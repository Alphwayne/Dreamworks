import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { reference } = await req.json();
        if (!reference) return NextResponse.json({ error: "Reference required" }, { status: 400 });

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        });
        const data = await response.json();

        if (!data.status || data.data.status !== "success") {
            return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
        }

        const metadata = data.data.metadata;

        // Save order to Supabase
        const { data: order, error } = await supabase
            .from("orders")
            .insert({
                order_number: `DW-${Date.now()}`,
                email: data.data.customer.email,
                financial_status: "paid",
                total: data.data.amount / 100,
                payment_method: "paystack",
                payment_reference: reference,
                shipping_name: metadata?.customer_name || "",
                shipping_phone: metadata?.phone || "",
                shipping_address1: metadata?.address || "",
                shipping_city: metadata?.city || "Lagos",
                shipping_country: "Nigeria",
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;

        // Save order items
        if (metadata?.items && order) {
            const items = metadata.items.map((item: any) => ({
                order_number: order.order_number,
                lineitem_name: item.product_name,
                lineitem_quantity: item.quantity,
                lineitem_price: item.selling_price,
                lineitem_sku: item.item_code,
                lineitem_fulfillment_status: "unfulfilled",
            }));
            await supabase.from("order_items").insert(items);
        }

        // Award DreamPoints (1 point per ₦1 spent)
        if (metadata?.user_id) {
            const pointsEarned = Math.floor(data.data.amount / 100);
            await supabase.from("dreampoints").upsert({
                user_id: metadata.user_id,
                points: pointsEarned,
                action: "purchase",
                order_number: order?.order_number,
                expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
        }

        // Send confirmation email
        try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email/order-confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.data.customer.email,
                    orderNumber: order?.order_number,
                    total: data.data.amount / 100,
                    items: metadata?.items || [],
                    customerName: metadata?.customer_name || "",
                }),
            });
        } catch { }

        return NextResponse.json({ success: true, orderNumber: order?.order_number });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Verification failed" }, { status: 500 });
    }
}