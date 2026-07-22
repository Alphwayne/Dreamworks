"use client";

import { CompareBar } from "./CompareBar";
import { SmartBundleBuilder } from "./SmartBundleBuilder";

export function GlobalOverlays() {
    return (
        <>
            <CompareBar />
            <SmartBundleBuilder />
        </>
    );
}
