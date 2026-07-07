import { Header } from "@/components/Header";

import { CartDrawer } from "@/components/CartDrawer";
import { Truck } from "lucide-react";

export default function ShippingPolicyPage() {
    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />
                <div className="relative py-16 px-4" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Truck size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Shipping Policy</h1>
                        <p className="text-blue-200">Fast, reliable delivery across Nigeria</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { zone: "Around Ikeja", fee: "FREE", time: "Same / Next day" },
                                { zone: "Other Lagos", fee: "₦2,000", time: "1-2 business days" },
                                { zone: "Outside Lagos", fee: "From ₦5,000", time: "2-5 business days" },
                            ].map((z) => (
                                <div key={z.zone} className="bg-blue-50 rounded-2xl p-4 text-center">
                                    <p className="font-bold text-gray-900 text-sm mb-1">{z.zone}</p>
                                    <p className="text-blue-700 font-bold text-lg">{z.fee}</p>
                                    <p className="text-gray-500 text-xs mt-1">{z.time}</p>
                                </div>
                            ))}
                        </div>

                        <Section title="Delivery Areas">
                            We offer free delivery to all locations around Ikeja, Lagos. For other parts of Lagos and Nigeria-wide, delivery fees apply and will be communicated clearly at checkout.
                        </Section>

                        <Section title="Processing Time">
                            Orders are processed within 24 hours of payment confirmation (excluding Sundays). You will receive a confirmation email and can track your order via WhatsApp.
                        </Section>

                        <Section title="Delivery Confirmation">
                            Our delivery team will contact you before arrival. Please ensure someone is available to receive and inspect the package on delivery.
                        </Section>

                        <Section title="Order Tracking">
                            Track your order anytime by messaging us on WhatsApp (+234 902 725 6852) with your order number.
                        </Section>

                        <Section title="Delayed or Lost Packages">
                            If your order is delayed beyond the estimated delivery window, contact our support team immediately. We will investigate and resolve the issue promptly, including reshipment if necessary.
                        </Section>

                        <Section title="International Shipping">
                            At this time, we only deliver within Nigeria. International shipping is not currently available.
                        </Section>
                    </div>
                </div>
                
            </div>
        </>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
        </div>
    );
}