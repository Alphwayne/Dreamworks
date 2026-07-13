"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

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
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number | null>(null);
    const posRef = useRef(0);
    const isPausedRef = useRef(false);
    const touchStartX = useRef(0);
    const touchStartPos = useRef(0);
    const resumeTimer = useRef<NodeJS.Timeout | null>(null);
    const [, forceRender] = useState(0);

    // Duplicate items for seamless infinite loop
    const displayCategories = [...categories, ...categories];

    // Speed: pixels per frame (~60fps). Higher = faster.
    const speed = 1.2;

    const animate = useCallback(() => {
        if (!trackRef.current) return;

        if (!isPausedRef.current) {
            posRef.current -= speed;

            // When we've scrolled past the first set, reset to 0 seamlessly
            const halfWidth = trackRef.current.scrollWidth / 2;
            if (Math.abs(posRef.current) >= halfWidth) {
                posRef.current = posRef.current + halfWidth;
            }
            // If user swiped forward (positive), wrap around
            if (posRef.current > 0) {
                posRef.current = posRef.current - halfWidth;
            }

            trackRef.current.style.transform = `translateX(${posRef.current}px)`;
        }

        animRef.current = requestAnimationFrame(animate);
    }, [speed]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
        };
    }, [animate]);

    const handleMouseEnter = () => { isPausedRef.current = true; };
    const handleMouseLeave = () => { isPausedRef.current = false; };

    const handleTouchStart = (e: React.TouchEvent) => {
        isPausedRef.current = true;
        touchStartX.current = e.touches[0].clientX;
        touchStartPos.current = posRef.current;
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const diff = e.touches[0].clientX - touchStartX.current;
        posRef.current = touchStartPos.current + diff;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${posRef.current}px)`;
        }
    };

    const handleTouchEnd = () => {
        // Wrap position if needed
        if (trackRef.current) {
            const halfWidth = trackRef.current.scrollWidth / 2;
            if (posRef.current > 0) posRef.current = posRef.current - halfWidth;
            if (Math.abs(posRef.current) >= halfWidth) posRef.current = posRef.current + halfWidth;
        }

        // Resume auto-scroll from current position after 2s
        resumeTimer.current = setTimeout(() => {
            isPausedRef.current = false;
        }, 2000);
    };

    return (
        <section className="relative w-full">
            <div
                className="relative overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={trackRef}
                    className="flex gap-5 py-2"
                    style={{
                        willChange: "transform",
                        WebkitTransform: "translateZ(0)",
                        transform: "translateZ(0)",
                        touchAction: "pan-x",
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={cat.isProduct ? `/products/${cat.slug}` : `/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card text-center w-[140px] sm:w-[160px] md:w-[180px]"
                        >
                            <div className="transition-all duration-500 group-hover/card:-translate-y-1.5 group-hover/card:scale-[1.03]">
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    loading="lazy"
                                    className="w-full h-[110px] sm:h-[125px] md:h-[140px] object-contain mix-blend-multiply group-hover/card:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <p className="mt-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 group-hover/card:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                {cat.label}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
