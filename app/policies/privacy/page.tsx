import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />
                <div className="relative py-16 px-4" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                        <p className="text-blue-200">How we collect, use, and protect your data</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 space-y-6">
                        <p className="text-gray-500 text-sm">Last updated: June 2026</p>

                        <Section title="Information We Collect">
                            We collect information you provide directly — name, email, phone number, delivery address — when you create an account, place an order, or contact us. We also collect usage data such as pages visited and items viewed to improve your shopping experience.
                        </Section>

                        <Section title="How We Use Your Information">
                            Your information is used to process orders, communicate order updates, provide customer support, send promotional offers (with your consent), award DreamPoints, and improve our products and services.
                        </Section>

                        <Section title="Payment Information">
                            We do not store your card details. All payments are processed securely through Paystack, a PCI-DSS compliant payment processor. Dreamworks Direct never has access to your full card number.
                        </Section>

                        <Section title="Data Sharing">
                            We do not sell your personal information. We may share data with delivery partners (to fulfil orders), payment processors (Paystack), and as required by Nigerian law.
                        </Section>

                        <Section title="Cookies">
                            We use cookies to keep you signed in, remember your cart, and understand how you use our site. You can disable cookies in your browser, though some features may not work as intended.
                        </Section>

                        <Section title="Your Rights">
                            You may request access to, correction of, or deletion of your personal data at any time by contacting ecommerce@dreamworksdirect.com.
                        </Section>

                        <Section title="Contact Us">
                            Questions about this policy? Reach us at ecommerce@dreamworksdirect.com or +234 912 758 5071.
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