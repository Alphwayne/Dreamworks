import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    },
});

function formatPrice(amount: number) {
    return "₦" + amount.toLocaleString("en-NG");
}

export async function POST(req: NextRequest) {
    try {
        const { email, orderNumber, total, items, customerName } = await req.json();

        const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <strong style="color:#0D0D0D;font-size:14px;">${item.product_name}</strong><br/>
          <span style="color:#64748B;font-size:12px;">Qty: ${item.quantity} · SKU: ${item.item_code}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;color:#003B7E;">
          ${formatPrice(item.selling_price * item.quantity)}
        </td>
      </tr>
    `).join("");

        const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="margin:0;padding:0;background:#f8faff;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;padding:40px 20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,59,126,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#003B7E 0%,#1565C0 100%);padding:32px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">DREAMWORKS DIRECT</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Nigeria's #1 Tech Marketplace</p>
                </td>
              </tr>

              <!-- Order confirmed -->
              <tr>
                <td style="padding:32px;text-align:center;">
                  <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:28px;">✅</span>
                  </div>
                  <h2 style="margin:0 0 8px;color:#0D0D0D;font-size:22px;">Order Confirmed!</h2>
                  <p style="margin:0;color:#64748B;font-size:15px;">
                    Hi ${customerName || "there"}, thank you for your order. We're getting it ready for you.
                  </p>
                </td>
              </tr>

              <!-- Order number -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <div style="background:#f0f4ff;border-radius:12px;padding:16px;text-align:center;">
                    <p style="margin:0;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Order Number</p>
                    <p style="margin:4px 0 0;color:#003B7E;font-size:24px;font-weight:800;">${orderNumber}</p>
                  </div>
                </td>
              </tr>

              <!-- Items -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <h3 style="margin:0 0 16px;color:#0D0D0D;font-size:16px;">Your Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemsHtml}
                    <tr>
                      <td style="padding:16px 0 0;font-weight:700;color:#0D0D0D;font-size:16px;">Total</td>
                      <td style="padding:16px 0 0;text-align:right;font-weight:800;color:#003B7E;font-size:20px;">${formatPrice(total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Delivery info -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;">
                    <p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">🚚 Delivery Info</p>
                    <p style="margin:8px 0 0;color:#92400e;font-size:13px;">
                      Free delivery to locations around Ikeja. For other areas, our team will contact you with delivery details.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Track on WhatsApp -->
              <tr>
                <td style="padding:0 32px 32px;text-align:center;">
                  <a href="https://wa.me/2349027256852?text=Hi! I'd like to track my order ${orderNumber}"
                     style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
                    📱 Track Order on WhatsApp
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8faff;padding:24px 32px;text-align:center;border-top:1px solid #f0f0f0;">
                  <p style="margin:0;color:#94a3b8;font-size:12px;">
                    83 Adeniyi Jones Avenue, Ikeja, Lagos · +234 912 758 5071<br/>
                    ecommerce@dreamworksdirect.com · dreamworksdirect.com
                  </p>
                  <p style="margin:8px 0 0;color:#cbd5e1;font-size:11px;">© 2026 Dreamworks Direct. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

        await transporter.sendMail({
            from: `"DreamWorks Direct" <${process.env.EMAIL_FROM}>`,
            to: email,
            bcc: process.env.EMAIL_FROM, // BCC store so they get a copy
            subject: `✅ Order Confirmed — ${orderNumber} | DreamWorks Direct`,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Email error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}