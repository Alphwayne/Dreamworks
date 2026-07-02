import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

// Get products by brand name (search in product_name)
export async function getProductsByBrand(brandName: string, limit = 24, offset = 0) {
    const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .ilike("product_name", `%${brandName}%`)
        .range(offset, offset + limit - 1);

    if (error) throw error;
    return { products: data as Product[], count: count || 0 };
}