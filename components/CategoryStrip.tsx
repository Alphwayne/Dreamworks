"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const animationRef = useRef<number>(0);
    const scrollSpeed = 0.5;

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        function animate() {
            if (!isPaused && container) {
                container.scrollLeft += scrollSpeed;
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        }

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPaused]);

    const displayCategories = [...categories, ...categories];

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
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-hidden py-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
        </section>
    );
}
