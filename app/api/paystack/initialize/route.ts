import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, amount, metadata } = await req.json();
        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount required" }, { status: 400 });
        }
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100),
                currency: "NGN",
                metadata,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/verify`,
            }),
        });
        const data = await response.json();
        if (!data.status) return NextResponse.json({ error: data.message }, { status: 400 });
        return NextResponse.json({
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
        });
    } catch {
        return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
    }
}