"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const slides = [
    {
        id: 1,
        image: "/dw-oraimo.png",
        cta: "Shop Oraimo",
        href: "/brands/oraimo",
        objectPosition: "center center",
    },
    {
        id: 2,
        image: "/dw-lg.png",
        cta: "Shop LG",
        href: "/brands/lg",
        objectPosition: "center center",
    },
    {
        id: 3,
        image: "/dw-hisensecup.png",
        cta: "Shop Hisense",
        href: "/brands/hisense",
        objectPosition: "center center",
    },
];

export function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    function goToSlide(index: number) {
        setCurrent(index);
    }

    return (
        <section className="relative h-[320px] sm:h-[420px] lg:h-[580px] overflow-hidden rounded-[20px] lg:rounded-[30px]">
            {/* All slides stacked — only opacity changes, so there's NEVER a blank gap */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{
                        opacity: index === current ? 1 : 0,
                        zIndex: index === current ? 2 : 1,
                    }}
                >
                    <Image
                        src={slide.image}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: slide.objectPosition }}
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
            ))}

            {/* CTA Button */}
            <div className="absolute bottom-8 left-1/2 -translate-x-[45%] z-20">
                <Link href={slides[current].href}>
                    <Button
                        className="group bg-white/15 backdrop-blur-lg hover:bg-white/25 text-white border border-white/30 rounded-full px-6 py-4 text-sm font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-xl"
                    >
                        {slides[current].cta}
                        <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="group relative"
                    >
                        <div
                            className={`h-1 rounded-full transition-all duration-500 ${index === current
                                ? "w-8 bg-white"
                                : "w-2 bg-white/30 group-hover:bg-white/50"
                                }`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
