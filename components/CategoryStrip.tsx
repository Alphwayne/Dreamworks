"use client";

import Link from "next/link";
import Image from "next/image";
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
                className="relative overflow-hidden rounded-2xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Very subtle fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/40 to-transparent z-10 pointer-events-none" />

                {/* Scrolling row */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={cat.isProduct ? `/products/${cat.slug}` : `/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card"
                        >
                            <div className="relative w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-[130px] sm:h-[150px] md:h-[170px] rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover/card:shadow-xl transition-all duration-500 group-hover/card:-translate-y-1">
                                {/* Background image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.label}
                                    fill
                                    className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                                    sizes="320px"
                                    quality={85}
                                />
                                {/* Dark gradient at bottom only */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                {/* Label at bottom - clean and minimal */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                    <p className="text-white font-bold text-sm md:text-base tracking-tight drop-shadow-md leading-tight">
                                        {cat.label}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
