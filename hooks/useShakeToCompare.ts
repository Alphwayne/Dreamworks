"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Product } from "@/lib/types";
import { useCompareStore } from "@/store/compareStore";

const SHAKE_THRESHOLD = 25; // Acceleration threshold
const SHAKE_TIMEOUT = 1000; // Time window for shake detection (ms)
const SHAKE_COUNT_THRESHOLD = 3; // Number of shakes needed

interface UseShakeToCompareOptions {
    product: Product;
    enabled?: boolean;
}

export function useShakeToCompare({ product, enabled = true }: UseShakeToCompareOptions) {
    const { toggleItem, isInCompare } = useCompareStore();
    const [shakeDetected, setShakeDetected] = useState(false);
    const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
    const shakeCount = useRef(0);
    const lastShakeTime = useRef(0);

    const handleShake = useCallback(() => {
        if (!enabled) return;
        toggleItem(product);
        setShakeDetected(true);
        setTimeout(() => setShakeDetected(false), 2000);

        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }, [enabled, product, toggleItem]);

    useEffect(() => {
        if (!enabled) return;
        if (typeof window === "undefined") return;
        if (!("DeviceMotionEvent" in window)) return;

        const handleMotion = (event: DeviceMotionEvent) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

            const deltaX = Math.abs(acc.x - lastAcceleration.current.x);
            const deltaY = Math.abs(acc.y - lastAcceleration.current.y);
            const deltaZ = Math.abs(acc.z - lastAcceleration.current.z);

            const totalDelta = deltaX + deltaY + deltaZ;

            lastAcceleration.current = { x: acc.x, y: acc.y, z: acc.z };

            if (totalDelta > SHAKE_THRESHOLD) {
                const now = Date.now();
                if (now - lastShakeTime.current < SHAKE_TIMEOUT) {
                    shakeCount.current++;
                    if (shakeCount.current >= SHAKE_COUNT_THRESHOLD) {
                        handleShake();
                        shakeCount.current = 0;
                    }
                } else {
                    shakeCount.current = 1;
                }
                lastShakeTime.current = now;
            }
        };

        window.addEventListener("devicemotion", handleMotion);
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, [enabled, handleShake]);

    return {
        shakeDetected,
        isComparing: isInCompare(product.id),
    };
}
