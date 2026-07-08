import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        // Get total orders count and revenue
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("id, total, created_at, billing_name, status");

        if (ordersError) {
            console.error("[API /admin/stats] Orders error:", ordersError.message);
        }

        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0) || 0;

        // Recent orders (last 10)
        const recentOrders = (orders || [])
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10);

        // Get total customers count
        const { count: totalCustomers, error: customersError } = await supabase
            .from("customers")
            .select("*", { count: "exact", head: true });

        if (customersError) {
            console.error("[API /admin/stats] Customers error:", customersError.message);
        }

        // Get total products count
        const { count: totalProducts, error: productsError } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });

        if (productsError) {
            console.error("[API /admin/stats] Products error:", productsError.message);
        }

        // Get active products count
        const { count: activeProducts } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        // Get low stock items (inventory quantity < 5)
        const { data: lowStock } = await supabase
            .from("inventory")
            .select("sku, quantity, warehouse")
            .lt("quantity", 5)
            .order("quantity", { ascending: true })
            .limit(10);

        // Get top selling products from order_items
        const { data: orderItems } = await supabase
            .from("order_items")
            .select("product_name, quantity, price");

        // Aggregate top products
        const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
        (orderItems || []).forEach((item) => {
            const key = item.product_name || "Unknown";
            if (!productSales[key]) {
                productSales[key] = { name: key, quantity: 0, revenue: 0 };
            }
            productSales[key].quantity += item.quantity || 1;
            productSales[key].revenue += (parseFloat(item.price) || 0) * (item.quantity || 1);
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Revenue by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const revenueByMonth: Record<string, number> = {};
        (orders || []).forEach((order) => {
            const date = new Date(order.created_at);
            if (date >= sixMonthsAgo) {
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                revenueByMonth[key] = (revenueByMonth[key] || 0) + (parseFloat(order.total) || 0);
            }
        });

        // Orders by status
        const ordersByStatus: Record<string, number> = {};
        (orders || []).forEach((order) => {
            const status = order.status || "unknown";
            ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
        });

        return NextResponse.json({
            totalOrders,
            totalRevenue,
            totalCustomers: totalCustomers || 0,
            totalProducts: totalProducts || 0,
            activeProducts: activeProducts || 0,
            recentOrders,
            lowStock: lowStock || [],
            topProducts,
            revenueByMonth,
            ordersByStatus,
        });
    } catch (err: any) {
        console.error("[API /admin/stats] Exception:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
