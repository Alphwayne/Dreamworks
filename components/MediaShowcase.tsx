"use client";
import { useRef, useEffect, useState } from "react";

function LazyVideo({ src, height, className }: { src: string; height: string; className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible && videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [isVisible]);

    return (
        <div
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden bg-gray-900 ${className || ""}`}
            style={{ height }}
        >
            {isVisible && (
                <video
                    ref={videoRef}
                    src={src}
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}

export function MediaShowcase() {
    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8">
                <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
                    Experience DreamWorks
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                    See the{" "}
                    <span className="text-blue-600 font-bold">DreamWorks Difference</span>
                </h2>
            </div>

            <div className="flex flex-col gap-5">
                {/* TOP — Full width video */}
                <LazyVideo
                    src="/69525a77-8310-4187-9ce9-635873d8f91c.mp4"
                    height="380px"
                />

                {/* BOTTOM — Two videos side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <LazyVideo
                        src="/Galaxy-Z-Fold7_Home_Hero_PC_1920x1080_LTR.mp4"
                        height="220px"
                    />
                    <LazyVideo
                        src="/Samsung vision.mp4"
                        height="220px"
                    />
                </div>
            </div>
        </section>
    );
}
