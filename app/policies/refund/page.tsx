import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { RotateCcw } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />
                <div className="relative py-16 px-4" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <RotateCcw size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Refund Policy</h1>
                        <p className="text-blue-200">3-day hassle-free refund guarantee</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 space-y-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                            <p className="text-blue-700 font-semibold text-sm">
                                ✓ You may request a refund within 3 days of receiving your item
                            </p>
                        </div>

                        <Section title="Eligibility for Refund">
                            To be eligible for a refund, your item must be unused, in the same condition you received it, and in the original packaging with all tags and accessories included. Proof of purchase (order number or receipt) is required.
                        </Section>

                        <Section title="Non-Refundable Items">
                            Certain items cannot be refunded, including: products with broken seals (for hygiene reasons), customised or made-to-order items, and items marked as final sale at the time of purchase.
                        </Section>

                        <Section title="How to Request a Refund">
                            Contact us via WhatsApp (+234 902 725 6852) or email (ecommerce@dreamworksdirect.com) within 3 days of delivery, quoting your order number. Our team will guide you through the return process.
                        </Section>

                        <Section title="Refund Processing">
                            Once we receive and inspect your returned item, we will notify you of the approval status. Approved refunds are processed within 5-7 business days back to your original payment method.
                        </Section>

                        <Section title="Damaged or Defective Items">
                            If you receive a damaged or defective product, contact us immediately with photos of the item. We will arrange a replacement or full refund at no additional cost to you.
                        </Section>

                        <Section title="Pay Small Small Refunds">
                            For orders made via our Dream Now, Pay Later (Pay Small Small) instalment plan, refunds will be processed according to instalments already paid, with remaining instalments cancelled.
                        </Section>
                    </div>
                </div>
                <BottomNav />
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