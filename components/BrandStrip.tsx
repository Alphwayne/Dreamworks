"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

const BRANDS = [
    { name: "HP", slug: "hp", border: "rgba(0,150,214,0.20)", glow: "rgba(0,150,214,0.12)", svg: <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none"><text x="4" y="36" fontSize="28" fontWeight="900" fill="#0096D6" fontFamily="Arial">hp</text></svg> },
    { name: "Samsung", slug: "samsung", border: "rgba(20,40,160,0.20)", glow: "rgba(20,40,160,0.10)", svg: <svg viewBox="0 0 80 20" className="w-16 h-5" fill="none"><text x="0" y="16" fontSize="14" fontWeight="700" fill="#1428A0" fontFamily="Arial" letterSpacing="1">SAMSUNG</text></svg> },
    { name: "LG", slug: "lg", border: "rgba(165,0,52,0.18)", glow: "rgba(165,0,52,0.10)", svg: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none"><circle cx="24" cy="24" r="22" stroke="#A50034" strokeWidth="2.5" fill="none" /><text x="7" y="31" fontSize="18" fontWeight="900" fill="#A50034" fontFamily="Arial">LG</text></svg> },
    { name: "Apple", slug: "apple", border: "rgba(29,29,31,0.15)", glow: "rgba(29,29,31,0.08)", svg: <svg viewBox="0 0 24 28" className="w-7 h-7" fill="#1d1d1f"><path d="M20.16 14.49c-.03-3.2 2.61-4.74 2.73-4.82-1.49-2.17-3.8-2.47-4.62-2.5-1.96-.2-3.84 1.16-4.83 1.16-.99 0-2.5-1.14-4.12-1.1-2.1.03-4.06 1.23-5.14 3.1-2.2 3.81-.56 9.43 1.57 12.52 1.04 1.51 2.28 3.2 3.9 3.14 1.57-.06 2.16-1.01 4.06-1.01 1.89 0 2.43 1.01 4.08.98 1.69-.03 2.76-1.52 3.79-3.04 1.2-1.74 1.69-3.43 1.72-3.52-.04-.01-3.3-1.27-3.34-5.01zM16.89 4.9c.87-1.05 1.45-2.5 1.29-3.95-1.25.05-2.76.83-3.65 1.87-.8.92-1.5 2.4-1.31 3.81 1.39.11 2.81-.71 3.67-1.73z" /></svg> },
    { name: "Dell", slug: "dell", border: "rgba(0,125,184,0.18)", glow: "rgba(0,125,184,0.10)", svg: <svg viewBox="0 0 60 24" className="w-14 h-6" fill="none"><text x="0" y="19" fontSize="20" fontWeight="900" fill="#007DB8" fontFamily="Arial" letterSpacing="-0.5">DELL</text></svg> },
    { name: "Sony", slug: "sony", border: "rgba(0,0,0,0.12)", glow: "rgba(0,0,0,0.06)", svg: <svg viewBox="0 0 60 20" className="w-14 h-5" fill="none"><text x="0" y="16" fontSize="16" fontWeight="700" fill="#000" fontFamily="Arial" letterSpacing="2">SONY</text></svg> },
    { name: "JBL", slug: "jbl", border: "rgba(243,112,33,0.22)", glow: "rgba(243,112,33,0.12)", svg: <svg viewBox="0 0 48 22" className="w-12 h-6" fill="none"><rect x="0" y="0" width="48" height="22" rx="4" fill="#F37021" /><text x="6" y="16" fontSize="14" fontWeight="900" fill="white" fontFamily="Arial">JBL</text></svg> },
    { name: "Hisense", slug: "hisense", border: "rgba(0,48,135,0.18)", glow: "rgba(0,48,135,0.10)", svg: <svg viewBox="0 0 80 18" className="w-16 h-5" fill="none"><text x="0" y="14" fontSize="13" fontWeight="800" fill="#003087" fontFamily="Arial" letterSpacing="0.5">Hisense</text></svg> },
    { name: "Canon", slug: "canon", border: "rgba(204,0,0,0.18)", glow: "rgba(204,0,0,0.10)", svg: <svg viewBox="0 0 70 20" className="w-16 h-5" fill="none"><text x="0" y="16" fontSize="16" fontWeight="700" fill="#CC0000" fontFamily="Arial" letterSpacing="1">Canon</text></svg> },
    { name: "DJI", slug: "dji", border: "rgba(26,26,26,0.12)", glow: "rgba(26,26,26,0.06)", svg: <svg viewBox="0 0 48 20" className="w-12 h-6" fill="none"><text x="0" y="16" fontSize="18" fontWeight="900" fill="#1A1A1A" fontFamily="Arial" letterSpacing="2">DJI</text></svg> },
    { name: "Lenovo", slug: "lenovo", border: "rgba(226,35,26,0.18)", glow: "rgba(226,35,26,0.10)", svg: <svg viewBox="0 0 80 20" className="w-16 h-5" fill="none"><text x="0" y="15" fontSize="14" fontWeight="800" fill="#E2231A" fontFamily="Arial" letterSpacing="0.5">Lenovo</text></svg> },
    { name: "Hikvision", slug: "hikvision", border: "rgba(204,0,0,0.16)", glow: "rgba(204,0,0,0.09)", svg: <svg viewBox="0 0 90 18" className="w-20 h-5" fill="none"><text x="0" y="14" fontSize="12" fontWeight="800" fill="#CC0000" fontFamily="Arial" letterSpacing="0.3">HIKVISION</text></svg> },
];

function BrandCard({ brand }: { brand: typeof BRANDS[number] }) {
    return (
        <Link
            href={`/collections/all?brand=${brand.slug}`}
            className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl py-5 px-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
            style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(240,246,255,0.75) 100%)",
                border: `1px solid ${brand.border}`,
                boxShadow: "0 2px 14px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
            }}
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${brand.glow} 0%, transparent 70%)` }}
            />
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)", animation: "shimmer 1.2s ease-in-out infinite" }}
            />
            <div className="flex items-center justify-center h-10 transition-all duration-300 group-hover:scale-110 relative z-10">
                {brand.svg}
            </div>
            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors uppercase tracking-widest relative z-10">
                {brand.name}
            </span>
        </Link>
    );
}

export function BrandStrip() {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number | null>(null);
    const posRef = useRef(0);
    const isPausedRef = useRef(false);
    const touchStartX = useRef(0);
    const touchStartPos = useRef(0);
    const resumeTimer = useRef<NodeJS.Timeout | null>(null);
    const [, forceRender] = useState(0);

    // Duplicate brands for seamless loop on mobile
    const mobileItems = [...BRANDS, ...BRANDS];

    // Speed: pixels per frame
    const speed = 1.1;

    const animate = useCallback(() => {
        if (!trackRef.current) return;

        if (!isPausedRef.current) {
            posRef.current -= speed;

            const halfWidth = trackRef.current.scrollWidth / 2;
            if (Math.abs(posRef.current) >= halfWidth) {
                posRef.current = posRef.current + halfWidth;
            }
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
        if (trackRef.current) {
            const halfWidth = trackRef.current.scrollWidth / 2;
            if (posRef.current > 0) posRef.current = posRef.current - halfWidth;
            if (Math.abs(posRef.current) >= halfWidth) posRef.current = posRef.current + halfWidth;
        }

        // Resume from current position after 2s
        resumeTimer.current = setTimeout(() => {
            isPausedRef.current = false;
        }, 2000);
    };

    return (
        <section
            className="relative py-14 px-4 overflow-hidden"
            style={{ background: "linear-gradient(135deg,#1e3a6e 0%,#1a3460 50%,#162d54 100%)" }}
        >
            {/* Glow blobs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)" }} />
            <div className="absolute -bottom-16 right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(129,140,248,0.14) 0%,transparent 70%)" }} />

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Official Partners</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            Premium Brands
                            <span className="block text-sm font-normal text-blue-300/60 mt-1">Every product — authentic &amp; verified</span>
                        </h2>
                    </div>
                    <Link
                        href="/collections/all"
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest border border-blue-400/30 hover:border-blue-300/50 px-4 py-2 rounded-xl"
                    >
                        Shop All →
                    </Link>
                </div>

                {/* Mobile: rAF-based auto-scrolling carousel (3 per view) with swipe */}
                <div className="md:hidden overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex gap-3"
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
                        {mobileItems.map((brand, i) => (
                            <div
                                key={`${brand.name}-${i}`}
                                className="flex-shrink-0"
                                style={{ width: "calc((100% - 1.5rem) / 3)" }}
                            >
                                <BrandCard brand={brand} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: grid layout (hidden on mobile) */}
                <div className="hidden md:grid grid-cols-4 md:grid-cols-6 gap-3">
                    {BRANDS.map((brand) => (
                        <BrandCard key={brand.name} brand={brand} />
                    ))}
                </div>

                {/* Scrolling ticker */}
                <div className="mt-10 overflow-hidden">
                    <div className="flex gap-10 whitespace-nowrap" style={{ animation: "scrollBrands 24s linear infinite" }}>
                        {[...BRANDS, ...BRANDS].map((b, i) => (
                            <span key={i} className="text-[11px] font-bold uppercase tracking-widest flex-shrink-0" style={{ color: "rgba(255,255,255,0.07)" }}>
                                {b.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scrollBrands {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </section>
    );
}
