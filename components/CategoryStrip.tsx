"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

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
    const trackRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const scrollOffset = useRef(0);
    const currentTranslate = useRef(0);
    const resumeTimer = useRef<NodeJS.Timeout | null>(null);

    // Duplicate items for seamless infinite loop
    const displayCategories = [...categories, ...categories];

    // Speed: faster than before (was categories.length * 3, now * 1.8)
    const duration = categories.length * 1.8;

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        touchStartX.current = e.touches[0].clientX;

        // Get current computed translateX
        if (trackRef.current) {
            const style = window.getComputedStyle(trackRef.current);
            const matrix = new DOMMatrix(style.transform);
            currentTranslate.current = matrix.m41;
            scrollOffset.current = currentTranslate.current;
            trackRef.current.style.animation = "none";
            trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
        }

        if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!trackRef.current) return;
        const diff = e.touches[0].clientX - touchStartX.current;
        const newTranslate = scrollOffset.current + diff;
        trackRef.current.style.transform = `translateX(${newTranslate}px)`;
        currentTranslate.current = newTranslate;
    };

    const handleTouchEnd = () => {
        if (!trackRef.current) return;

        // Wrap around if scrolled too far
        const trackWidth = trackRef.current.scrollWidth / 2;
        let finalPos = currentTranslate.current;
        if (finalPos > 0) finalPos = -trackWidth + finalPos;
        if (finalPos < -trackWidth) finalPos = finalPos + trackWidth;

        trackRef.current.style.transform = `translateX(${finalPos}px)`;
        currentTranslate.current = finalPos;

        // Resume auto-scroll after 2.5s
        resumeTimer.current = setTimeout(() => {
            if (trackRef.current) {
                // Calculate what percentage through the animation we are
                const trackWidth = trackRef.current.scrollWidth / 2;
                const progress = Math.abs(finalPos) / trackWidth;
                const remainingDuration = duration * (1 - progress);

                trackRef.current.style.animation = "";
                trackRef.current.style.transform = "";
                trackRef.current.style.animationDelay = `-${progress * duration}s`;
            }
            setIsPaused(false);
        }, 2500);
    };

    useEffect(() => {
        return () => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
        };
    }, []);

    return (
        <section className="relative w-full">
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    ref={trackRef}
                    className="flex gap-5 py-2 category-scroll-track"
                    style={{
                        animationPlayState: isPaused ? "paused" : "running",
                        animationDuration: `${duration}s`,
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
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
                    animation: categoryScroll ${duration}s linear infinite;
                    will-change: transform;
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                    touch-action: pan-x;
                }
            `}</style>
        </section>
    );
}
