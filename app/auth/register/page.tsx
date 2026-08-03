"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Register page now redirects to the combined sign-in/sign-up page
// The combined page at /auth/signin handles both sign-in and registration
export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the combined auth page with a hash to trigger sign-up mode
        router.replace("/auth/signin#register");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #eef2ff 0%, #f8faff 50%, #f0f7ff 100%)" }}>
            <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
    );
}
