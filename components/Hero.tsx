"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-[-50%] right-[-30%] w-[800px] h-[800px] rounded-full bg-white/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-[-50%] left-[-30%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10"
                    >
                        <Sparkles className="w-4 h-4" />
                        Premium Tech & Gadgets
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4"
                    >
                        Dream Now,
                        <br />
                        <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                            Pay Later.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto"
                    >
                        Innovating a Brighter Life
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Button className="bg-white text-blue-700 hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-full px-10 py-7 text-lg font-semibold shadow-2xl shadow-blue-900/30 group">
                            Shop Now
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>

                    {/* Brand Logos Strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-12 flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-white/10"
                    >
                        <span className="text-blue-200/70 text-sm font-medium">Trusted Brands:</span>
                        <div className="flex flex-wrap items-center gap-6">
                            {["Hisense", "NEXUS", "HP", "HIKVISION", "Canon"].map((brand) => (
                                <span key={brand} className="text-white/80 text-sm font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}