"use client";

import Link from "next/link";
import { useState } from "react";

interface CategoryItem {
    label: string;
    slug: string;
    image: string;
    count?: number;
    isProduct?: boolean;
}

interface CategoryStripProps {
    categories: CategoryItem[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate items for seamless infinite loop
    const displayCategories = [...categories, ...categories];

    // Calculate animation duration based on item count (slower = smoother)
    const duration = categories.length * 3;

    return (
        <section className="relative w-full">
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
            >
                <div
                    className="flex gap-5 py-2 category-scroll-track"
                    style={{
                        animationPlayState: isPaused ? "paused" : "running",
                        animationDuration: `${duration}s`,
                    }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={cat.isProduct ? `/products/${cat.slug}` : `/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card text-center"
                        >
                            {/* Image card - image fills edge to edge */}
                            <div className="relative w-[150px] sm:w-[170px] md:w-[190px] h-[130px] sm:h-[145px] md:h-[160px] rounded-2xl overflow-hidden shadow-md group-hover/card:shadow-xl group-hover/card:shadow-blue-500/10 transition-all duration-500 group-hover/card:-translate-y-1.5 group-hover/card:scale-[1.03] bg-gray-100">
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                                />
                            </div>
                            {/* Name OUTSIDE and BELOW the image */}
                            <p className="mt-2.5 text-[11px] sm:text-xs font-semibold text-gray-700 group-hover/card:text-blue-600 transition-colors line-clamp-2 max-w-[150px] sm:max-w-[170px] md:max-w-[190px] mx-auto leading-tight">
                                {cat.label}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes categoryScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .category-scroll-track {
                    animation: categoryScroll 30s linear infinite;
                    will-change: transform;
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                }
            `}</style>
        </section>
    );
}
