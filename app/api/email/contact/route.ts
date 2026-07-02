import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_PASSWORD },
});

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        await transporter.sendMail({
            from: `"DreamWorks Contact Form" <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_FROM,
            replyTo: email,
            subject: `New Contact Message from ${name}`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;">
          <h2 style="color:#003B7E;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background:#f0f4ff;padding:16px;border-radius:8px;">${message}</p>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}