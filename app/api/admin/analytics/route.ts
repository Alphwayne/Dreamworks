import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";

    try {
        // Get orders with date filter
        let ordersQuery = supabase.from("orders").select("*");

        if (period === "today") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            ordersQuery = ordersQuery.gte("created_at", today.toISOString());
        } else if (period === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            ordersQuery = ordersQuery.gte("created_at", weekAgo.toISOString());
        } else if (period === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            ordersQuery = ordersQuery.gte("created_at", monthAgo.toISOString());
        }

        const { data: orders, error: ordersError } = await ordersQuery;

        if (ordersError) {
            console.error("[API /admin/analytics] Orders error:", ordersError.message);
        }

        const allOrders = orders || [];
        const totalRevenue = allOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
        const totalOrders = allOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Revenue by month
        const revenueByMonth: Record<string, { revenue: number; orders: number }> = {};
        allOrders.forEach((order) => {
            const date = new Date(order.created_at);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!revenueByMonth[key]) revenueByMonth[key] = { revenue: 0, orders: 0 };
            revenueByMonth[key].revenue += parseFloat(order.total) || 0;
            revenueByMonth[key].orders += 1;
        });

        // Orders by status
        const ordersByStatus: Record<string, number> = {};
        allOrders.forEach((order) => {
            const status = order.financial_status || "unknown";
            ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
        });

        // Fulfillment breakdown
        const fulfillmentBreakdown: Record<string, number> = {};
        allOrders.forEach((order) => {
            const status = order.fulfillment_status || "unfulfilled";
            fulfillmentBreakdown[status] = (fulfillmentBreakdown[status] || 0) + 1;
        });

        // Get order items for category breakdown
        const { data: orderItems } = await supabase
            .from("order_items")
            .select("lineitem_name, lineitem_price, lineitem_quantity");

        const categoryBreakdown: Record<string, { count: number; revenue: number }> = {};
        (orderItems || []).forEach((item) => {
            const cat = item.lineitem_name?.split(" ")[0] || "Other";
            if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { count: 0, revenue: 0 };
            categoryBreakdown[cat].count += item.lineitem_quantity || 1;
            categoryBreakdown[cat].revenue += (item.lineitem_price || 0) * (item.lineitem_quantity || 1);
        });

        // Top customers
        const { data: topCustomers } = await supabase
            .from("customers")
            .select("email, first_name, last_name, total_spent, total_orders")
            .order("total_spent", { ascending: false })
            .limit(10);

        // Monthly growth calculation
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const lastMonth = now.getMonth() === 0
            ? `${now.getFullYear() - 1}-12`
            : `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;

        const thisMonthRevenue = revenueByMonth[thisMonth]?.revenue || 0;
        const lastMonthRevenue = revenueByMonth[lastMonth]?.revenue || 0;
        const monthlyGrowth = lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
            : 0;

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            avgOrderValue,
            revenueByMonth,
            ordersByStatus,
            fulfillmentBreakdown,
            categoryBreakdown,
            topCustomers: topCustomers || [],
            monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
        });
    } catch (err: any) {
        console.error("[API /admin/analytics] Exception:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
