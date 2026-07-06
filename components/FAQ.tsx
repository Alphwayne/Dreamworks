"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
    {
        question: "Are all products on DreamWorks Direct authentic?",
        answer: "Yes, every product sold on DreamWorks Direct is 100% authentic and sourced directly from official brand distributors. We have been a trusted technology partner in Nigeria for over 22 years, and our reputation is built on authenticity.",
    },
    {
        question: "What payment options are available?",
        answer: "We accept Visa, Mastercard, bank transfers, and Paystack payments. We also offer our 'Pay Small Small' instalment plan, allowing you to spread the cost of your purchase over several months with no hidden charges.",
    },
    {
        question: "How does the Trade-In program work?",
        answer: "Bring in your old device (laptop, phone, or tablet) to our store or contact us online. Our experts will assess its value and offer you credit towards a new purchase. It's a great way to upgrade affordably.",
    },
    {
        question: "What is your return and refund policy?",
        answer: "We offer a hassle-free return policy. If you're not satisfied with your purchase, you can return it within the specified period for a full refund or exchange. Please visit our Refund Policy page for full details.",
    },
    {
        question: "Do you offer nationwide delivery?",
        answer: "Yes! We deliver across Nigeria. Orders within Lagos (especially Ikeja) enjoy free and fast delivery. For other locations, delivery fees and timelines vary. You can check delivery options at checkout.",
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive a confirmation email with a tracking number. You can also track your order by logging into your account on our website and visiting the 'Orders' section.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <HelpCircle size={16} className="text-blue-500" />
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">FAQ</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
                {FAQS.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-5 text-left"
                        >
                            <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                            <ChevronDown
                                size={18}
                                className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-blue-600" : ""
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 pb-5" : "max-h-0"
                                }`}
                        >
                            <p className="px-5 text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
