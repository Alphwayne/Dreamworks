import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { Shield, Award, Users, Truck, Clock, Star, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

const MILESTONES = [
    { year: "2002", event: "Dreamworks founded in Lagos, Nigeria" },
    { year: "2008", event: "Became authorised HP dealer for Nigeria" },
    { year: "2015", event: "Expanded to full tech marketplace — 200+ brands" },
    { year: "2020", event: "Launched dreamworksdirect.com — online store" },
    { year: "2022", event: "Reached 5,000+ customers milestone" },
    { year: "2024", event: "Launched DreamPoints loyalty programme" },
    { year: "2026", event: "10,000+ customers · 500+ products · 22 years strong" },
];

const VALUES = [
    { icon: <Shield size={24} />, title: "Authenticity", desc: "Every product is 100% genuine. We are an authorised dealer for all major brands we carry." },
    { icon: <Award size={24} />, title: "Excellence", desc: "22 years of delivering quality technology to Nigerians across the country." },
    { icon: <Users size={24} />, title: "Community", desc: "Over 10,000 customers trust us. We're not just a store — we're a technology partner." },
    { icon: <Truck size={24} />, title: "Reliability", desc: "Fast delivery across Lagos and Nigeria. Free delivery to locations around Ikeja." },
    { icon: <Clock size={24} />, title: "Support", desc: "24/7 customer support via WhatsApp, phone and email. We're always here." },
    { icon: <Star size={24} />, title: "Value", desc: "Competitive pricing, flexible payment (Pay Small Small), and a loyalty programme that rewards you." },
];

export default function AboutPage() {
    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f5f0ff 100%)" }}>
                <Header />

                {/* Hero */}
                <div className="relative py-24 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #003B7E 0%, #1565C0 50%, #0a0a2e 100%)" }}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                    <div className="relative max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Nigeria's #1 Tech Marketplace</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            About<br />
                            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                Dreamworks Direct
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                            22 years of excellence in technology retail. We don't just sell tech — we deliver experiences, build relationships, and empower Nigerians through the power of technology.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { value: "22+", label: "Years in Business" },
                            { value: "10,863", label: "Happy Customers" },
                            { value: "751+", label: "Orders Fulfilled" },
                            { value: "500+", label: "Products Available" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{stat.value}</p>
                                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Who we are */}
                <section className="max-w-5xl mx-auto px-4 mb-16">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 md:p-12">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 block">Who We Are</span>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Building Nigeria's Tech Future
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Dreamworks Direct is Nigeria's premier technology marketplace, operating for over 22 years from our flagship store at 83 Adeniyi Jones Avenue, Ikeja, Lagos.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We are an authorised dealer for the world's leading technology brands — HP, Samsung, LG, JBL, Hisense, Canon, DJI, Hikvision, Binatone, Nexus and more. Every product we sell is genuine, warranted, and sourced directly from brand-authorised distributors.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Our mission is simple: make world-class technology accessible to every Nigerian, with flexible payment options, fast delivery, and the kind of after-sales support you can actually count on.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-700 to-purple-800 p-8 md:p-12 flex flex-col justify-center">
                                <h3 className="text-white font-bold text-xl mb-6">Our Brand Partners</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {["HP", "Samsung", "LG", "JBL", "Hisense", "Canon", "DJI", "Hikvision", "Nexus"].map((brand) => (
                                        <div key={brand} className="bg-white/10 border border-white/20 rounded-xl py-2 text-center">
                                            <span className="text-white font-bold text-sm">{brand}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="max-w-5xl mx-auto px-4 mb-16">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 block">What We Stand For</span>
                        <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {VALUES.map((v, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all hover:-translate-y-1 group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-700 group-hover:text-white transition-all">
                                    {v.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Timeline */}
                <section className="max-w-3xl mx-auto px-4 mb-16">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 block">Our Journey</span>
                        <h2 className="text-3xl font-bold text-gray-900">22 Years of Excellence</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600" />
                        <div className="space-y-6">
                            {MILESTONES.map((m, i) => (
                                <div key={i} className="flex items-start gap-6 pl-8 relative">
                                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-4 border-white shadow-lg" style={{ marginLeft: "24px" }} />
                                    <div className="flex-shrink-0 w-12 text-right">
                                        <span className="text-xs font-bold text-blue-600">{m.year}</span>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex-1 shadow-sm">
                                        <p className="text-gray-700 text-sm">{m.event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact info */}
                <section className="max-w-5xl mx-auto px-4 mb-16">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-3xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Visit Us or Get in Touch</h2>
                                <p className="text-blue-200 text-sm mb-6">We're here for you — online and in-store.</p>
                                <div className="space-y-4">
                                    {[
                                        { icon: <MapPin size={16} />, text: "83 Adeniyi Jones Avenue, Ikeja, Lagos, Nigeria" },
                                        { icon: <Phone size={16} />, text: "+234 912 758 5071 · +234 907 040 2023" },
                                        { icon: <Mail size={16} />, text: "ecommerce@dreamworksdirect.com" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-200 flex-shrink-0 mt-0.5">
                                                {item.icon}
                                            </div>
                                            <span className="text-blue-100 text-sm">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link href="/collections/all" className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-colors text-sm">
                                    Shop Now →
                                </Link>
                                <a
                                    href="https://wa.me/2349027256852"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-600 transition-colors text-sm"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <BottomNav />
            </div>
        </>
    );
}