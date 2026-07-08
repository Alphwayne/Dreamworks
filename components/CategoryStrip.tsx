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
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Very subtle fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f8f9fa]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f8f9fa]/80 to-transparent z-10 pointer-events-none" />

                {/* Scrolling row */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-hidden py-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={cat.isProduct ? `/products/${cat.slug}` : `/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card"
                        >
                            <div className="flex flex-col items-center gap-2.5">
                                {/* Image container - properly sized with visible image */}
                                <div className="relative w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] h-[160px] sm:h-[180px] md:h-[200px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover/card:shadow-xl transition-all duration-500 group-hover/card:-translate-y-1 border border-gray-100/50">
                                    <Image
                                        src={cat.image}
                                        alt={cat.label}
                                        fill
                                        className="object-contain p-3 group-hover/card:scale-110 transition-transform duration-700"
                                        sizes="250px"
                                        quality={90}
                                        unoptimized
                                    />
                                </div>
                                {/* Name BELOW the image container */}
                                <p className="text-gray-800 font-semibold text-xs md:text-sm text-center max-w-[200px] leading-tight line-clamp-2 group-hover/card:text-blue-600 transition-colors">
                                    {cat.label}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
