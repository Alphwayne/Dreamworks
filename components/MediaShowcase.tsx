"use client";
import { useRef, useEffect } from "react";

export function MediaShowcase() {
    const topVideoRef = useRef<HTMLVideoElement>(null);
    const bottomLeftVideoRef = useRef<HTMLVideoElement>(null);
    const bottomRightVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Play all videos on mount
        const playVideos = async () => {
            try {
                if (topVideoRef.current) await topVideoRef.current.play();
                if (bottomLeftVideoRef.current) await bottomLeftVideoRef.current.play();
                if (bottomRightVideoRef.current) await bottomRightVideoRef.current.play();
            } catch (error) {
                // Autoplay may be blocked by browser — silently handle
                console.log("Autoplay prevented, user interaction required");
            }
        };
        playVideos();
    }, []);

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
                <div
                    className="relative rounded-3xl overflow-hidden bg-black w-full"
                    style={{ height: "380px" }}
                >
                    <video
                        ref={topVideoRef}
                        src="/69525a77-8310-4187-9ce9-635873d8f91c.mp4"
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* BOTTOM — Two videos side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Bottom Left — Galaxy Z Fold video */}
                    <div
                        className="relative rounded-3xl overflow-hidden bg-black"
                        style={{ height: "220px" }}
                    >
                        <video
                            ref={bottomLeftVideoRef}
                            src="/Galaxy-Z-Fold7_Home_Hero_PC_1920x1080_LTR.mp4"
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Bottom Right — Samsung Vision video */}
                    <div
                        className="relative rounded-3xl overflow-hidden bg-black"
                        style={{ height: "220px" }}
                    >
                        <video
                            ref={bottomRightVideoRef}
                            src="/Samsung vision.mp4"
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}