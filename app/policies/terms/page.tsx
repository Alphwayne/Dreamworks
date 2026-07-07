import { Header } from "@/components/Header";

import { CartDrawer } from "@/components/CartDrawer";
import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />
                <div className="relative py-16 px-4" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
                        <p className="text-blue-200">The rules of using dreamworksdirect.com</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 space-y-6">
                        <p className="text-gray-500 text-sm">Last updated: June 2026</p>

                        <Section title="Acceptance of Terms">
                            By accessing and using dreamworksdirect.com, you agree to be bound by these Terms of Service and our Privacy Policy.
                        </Section>

                        <Section title="Account Registration">
                            You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
                        </Section>

                        <Section title="Product Listings & Pricing">
                            We strive for accuracy in product descriptions and pricing. In the event of an error, we reserve the right to cancel orders placed at incorrect prices, with a full refund issued.
                        </Section>

                        <Section title="Orders & Payment">
                            All orders are subject to availability and confirmation. Payment is processed securely via Paystack. We accept card payments, bank transfer, and our Dream Now, Pay Later (Pay Small Small) instalment plan.
                        </Section>

                        <Section title="Delivery">
                            Delivery is free to locations around Ikeja. Other Lagos and Nigeria-wide locations may incur a delivery fee, communicated at checkout or via our customer service team.
                        </Section>

                        <Section title="DreamPoints Loyalty Programme">
                            DreamPoints are earned through purchases, sign-ups, and social media engagement, as outlined on our DreamPoints page. Points expire 6 months from the date earned and have no cash value outside of redemption on our platform.
                        </Section>

                        <Section title="Intellectual Property">
                            All content on this site — including logos, text, images, and design — is the property of Dreamworks Integrated Systems Ltd. and may not be reproduced without permission.
                        </Section>

                        <Section title="Limitation of Liability">
                            Dreamworks Direct is not liable for indirect, incidental, or consequential damages arising from the use of our products or services, to the extent permitted by Nigerian law.
                        </Section>

                        <Section title="Changes to Terms">
                            We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.
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