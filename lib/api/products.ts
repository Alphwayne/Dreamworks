import { supabase } from "@/lib/supabase";
import { Product, Inventory } from "@/lib/types";

// Get all products with optional filters
export async function getProducts({
    category,
    search,
    limit = 24,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc",
}: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
} = {}) {
    let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1);

    if (category) {
        query = query.eq("category", category);
    }

    if (search) {
        query = query.ilike("product_name", `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { products: data as Product[], count: count || 0 };
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) return null;
    return data as Product;
}

// Get single product by id
export async function getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data as Product;
}

// Get related products — same category, exclude current
export async function getRelatedProducts(category: string, excludeId: number, limit = 4): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("is_active", true)
        .neq("id", excludeId)
        .limit(limit);

    if (error) return [];
    return data as Product[];
}

// Get featured products for homepage sections
export async function getFeaturedProducts(category: string, limit = 4): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("is_active", true)
        .order("selling_price", { ascending: false })
        .limit(limit);

    if (error) return [];
    return data as Product[];
}

// Get all distinct categories with product counts
export async function getCategories() {
    const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("is_active", true);

    if (error) return [];

    const counts: Record<string, number> = {};
    (data || []).forEach((row: { category: string }) => {
        counts[row.category] = (counts[row.category] || 0) + 1;
    });

    return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

// Get inventory for a product by item_code (sku)
export async function getInventory(sku: string): Promise<Inventory | null> {
    const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("sku", sku)
        .single();

    if (error) return null;
    return data as Inventory;
}

// Search products
export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .ilike("product_name", `%${query}%`)
        .limit(limit);

    if (error) return [];
    return data as Product[];
}

// Get products by multiple categories (for homepage)
export async function getProductsByCategories(categories: string[], limitEach = 8): Promise<Record<string, Product[]>> {
    const results: Record<string, Product[]> = {};

    await Promise.all(
        categories.map(async (cat) => {
            const { data } = await supabase
                .from("products")
                .select("*")
                .eq("category", cat)
                .eq("is_active", true)
                .limit(limitEach);
            results[cat] = (data || []) as Product[];
        })
    );

    return results;
}