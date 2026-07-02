"use client";

import Link from "next/link";
import { Gift, MessageCircle, Cloud } from "lucide-react";

export function InfoBar() {
    return (
        <div className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between h-16 gap-4">
                    {/* DreamPoints */}
                    <Link href="/dreampoints" className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold">DreamPoints</div>
                            <div className="text-xs text-gray-500">Earn rewards</div>
                        </div>
                    </Link>

                    {/* Weather */}
                    <div className="flex items-center gap-3 text-sm">
                        <Cloud className="w-5 h-5 text-gray-400" />
                        <div>
                            <div className="font-semibold">80°F</div>
                            <div className="text-xs text-gray-500">T-storms</div>
                        </div>
                    </div>

                    {/* Chat Support */}
                    <Link href="/support" className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-semibold">Need Help?</div>
                            <div className="text-xs text-gray-500">Chat with us</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}