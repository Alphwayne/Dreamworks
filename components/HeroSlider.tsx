"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

    return (
        <section className="relative h-[520px] lg:h-[580px] overflow-hidden rounded-[20px] lg:rounded-[30px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0 rounded-[20px] lg:rounded-[30px] overflow-hidden"
                >
                    <Image
                        src={slides[current].image}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: slides[current].objectPosition }}
                        priority
                        sizes="100vw"
                        quality={100}
                        unoptimized
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Button - slightly left of center */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="absolute bottom-8 left-1/2 -translate-x-[45%] z-10"
                    >
                        <Link href={slides[current].href}>
                            <Button
                                className="group bg-white/15 backdrop-blur-lg hover:bg-white/25 text-white border border-white/30 rounded-full px-6 py-4 text-sm font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-xl"
                            >
                                {slides[current].cta}
                                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
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
                </motion.div>
            </AnimatePresence>
        </section>
    );
}