import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-server";

// POST - upload blog image to Supabase Storage
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `blog_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("public-assets")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            // If bucket doesn't exist, try creating it
            if (error.message.includes("not found") || error.message.includes("Bucket")) {
                await supabase.storage.createBucket("public-assets", { public: true });
                const { data: retryData, error: retryError } = await supabase.storage
                    .from("public-assets")
                    .upload(filePath, buffer, {
                        contentType: file.type,
                        upsert: false,
                    });
                if (retryError) {
                    console.error("Blog image upload retry error:", retryError.message);
                    return NextResponse.json({ error: retryError.message }, { status: 500 });
                }
            } else {
                console.error("Blog image upload error:", error.message);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("public-assets")
            .getPublicUrl(filePath);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch (err: any) {
        console.error("Blog image upload unexpected error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
