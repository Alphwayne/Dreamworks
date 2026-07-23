"use client";

import { CompareBar } from "./CompareBar";
import { SmartBundleBuilder } from "./SmartBundleBuilder";
import { WishlistToast } from "./WishlistToast";

export function GlobalOverlays() {
    return (
        <>
            <CompareBar />
            <SmartBundleBuilder />
            <WishlistToast />
        </>
    );
}
