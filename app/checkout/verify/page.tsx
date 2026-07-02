"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useCartStore } from "@/store/cartStore";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCartStore();

    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [orderNumber, setOrderNumber] = useState("");

    useEffect(() => {
        const reference = searchParams.get("reference") || searchParams.get("trxref");
        if (!reference) {
            setStatus("failed");
            return;
        }

        fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOrderNumber(data.orderNumber);
                    setStatus("success");
                    clearCart();
                } else {
                    setStatus("failed");
                }
            })
            .catch(() => setStatus("failed"));
    }, [searchParams, clearCart]);

    return (
        <div className="flex items-center justify-center px-4 py-20">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 shadow-sm">
                {status === "loading" && (
                    <>
                        <Loader2 size={48} className="text-blue-600 mx-auto mb-4 animate-spin" />
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying your payment...</h1>
                        <p className="text-gray-500 text-sm">Please don't close this page.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-500 mb-4">Your order has been confirmed.</p>
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="text-2xl font-bold text-blue-700">{orderNumber}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to you.</p>
                        <div className="space-y-3">
                            <a
                                href={`https://wa.me/2349027256852?text=Hi! I'd like to track my order ${orderNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                            >
                                Track Order on WhatsApp
                            </a>
                            <Link href="/" className="block w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X size={32} className="text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
                        <p className="text-gray-500 mb-6">If you were charged, please contact us with your reference number.</p>
                        <div className="space-y-3">
                            <a
                                href="https://wa.me/2349027256852"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                            >
                                Contact Support
                            </a>
                            <Link href="/checkout" className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                Try Again
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyPaymentPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Suspense fallback={
                <div className="flex items-center justify-center px-4 py-20">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 shadow-sm">
                        <Loader2 size={48} className="text-blue-600 mx-auto mb-4 animate-spin" />
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Loading...</h1>
                    </div>
                </div>
            }>
                <VerifyContent />
            </Suspense>
        </div>
    );
}