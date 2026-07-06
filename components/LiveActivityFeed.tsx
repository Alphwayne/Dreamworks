"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, MapPin } from "lucide-react";

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City", "Kaduna", "Warri", "Abeokuta"];
const FIRST_NAMES = ["Chidi", "Amara", "Tunde", "Ngozi", "Emeka", "Fatima", "Oluwaseun", "Adaeze", "Yusuf", "Blessing", "Kelechi", "Aisha", "Obinna", "Funke", "Ibrahim"];
const TIME_AGO = ["2 min ago", "5 min ago", "8 min ago", "12 min ago", "15 min ago", "20 min ago", "25 min ago"];

interface ActivityItem {
    id: number;
    name: string;
    city: string;
    product: string;
    time: string;
}

export function LiveActivityFeed({ productNames }: { productNames: string[] }) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [visible, setVisible] = useState(true);
    const [currentActivity, setCurrentActivity] = useState(0);

    useEffect(() => {
        // Generate initial activities from real product names
        const generated = productNames.slice(0, 8).map((name, i) => ({
            id: i,
            name: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
            city: CITIES[Math.floor(Math.random() * CITIES.length)],
            product: name.length > 35 ? name.substring(0, 35) + "..." : name,
            time: TIME_AGO[Math.floor(Math.random() * TIME_AGO.length)],
        }));
        setActivities(generated);
    }, [productNames]);

    useEffect(() => {
        if (activities.length === 0) return;

        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setCurrentActivity((prev) => (prev + 1) % activities.length);
                setVisible(true);
            }, 500);
        }, 6000);

        return () => clearInterval(interval);
    }, [activities.length]);

    if (activities.length === 0) return null;

    const activity = activities[currentActivity];

    return (
        <div
            className={`fixed bottom-24 left-4 z-40 max-w-[320px] transition-all duration-500 ${visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                }`}
        >
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-3.5 flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <ShoppingBag size={18} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900 font-semibold leading-tight">
                        <span className="text-blue-600">{activity?.name}</span> just purchased
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1 font-medium">
                        {activity?.product}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                            <MapPin size={9} /> {activity?.city}
                        </span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-400">{activity?.time}</span>
                    </div>
                </div>

                {/* Live indicator */}
                <div className="flex-shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                </div>
            </div>
        </div>
    );
}
