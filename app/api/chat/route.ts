import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-server";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Store knowledge base for the system prompt
const STORE_KNOWLEDGE = `
You are DreamGuide, the personal shopping companion for DreamWorks Direct (also known as Dreamworks Integrated Systems).

## About the Store
- DreamWorks Direct is a premium electronics and technology retailer in Nigeria with 22+ years of experience.
- We sell Computing devices, Mobile phones, Consumer Electronics, Enterprise solutions, Accessories, Power solutions, and Apple products.
- Website: dreamworks-alpha.vercel.app
- WhatsApp: +234 902 725 6852
- We serve customers across Nigeria with delivery options.

## Product Categories
- **Computing**: Laptops, Desktops, Printers, Ink & Toner
- **Mobile**: Phones (iPhone, Samsung, Tecno, Infinix, etc.), Tablets, Mobile Accessories
- **Consumer Electronics**: Kitchen appliances, Home Appliances, Audio & Video, Cameras, Arcade/Gaming
- **Enterprise**: CCTV, Access Control, Smart Home, Door Locks
- **Power**: Generators, Inverters, UPS, Power Banks, Solar
- **Apple**: iPhones, iPads, MacBooks, Apple Accessories
- **Accessories**: Cases, Screen Protectors, Chargers, Cables, etc.

## Payment Options
- **Paystack**: Secure online payment (cards, bank transfer, USSD)
- **Dream Now Pay Later**: Our installment payment plan for qualifying customers
- **Bank Transfer**: Direct bank transfer option available

## DreamPoints Loyalty Program
- Earn points on every purchase (1 point per ₦1 spent)
- Sign up bonus: 50,000 points
- Follow on Instagram: 20,000 points
- Follow on TikTok: 20,000 points
- Refer a friend: ₦1,500 bonus
- Redemption: 100,000 points = ₦1,000 discount
- Points expire after 6 months

## Shipping & Delivery
- We deliver across Nigeria
- Lagos delivery: 1-3 business days
- Other states: 3-7 business days
- Express delivery available for Lagos
- Free delivery on orders above ₦100,000

## Returns & Warranty
- 7-day return policy for defective items
- Items must be in original packaging
- Manufacturer warranty applies to all products
- Extended warranty available on select items

## Customer Support Hours
- Monday to Friday: 8am - 6pm
- Saturday: 9am - 4pm
- Sunday: Closed
- WhatsApp support available during business hours

## Your Behavior Guidelines
- Be professional, friendly, and helpful
- Use Nigerian English naturally (e.g., "How can I help you today?")
- If asked about specific product prices or availability, search the product database
- If you don't know something specific, say so honestly and offer to connect them with a human agent
- Never make up prices or product details - only share what's in the database
- Keep responses concise but informative (2-4 sentences for simple questions)
- For complex issues (refunds, complaints, technical problems), recommend speaking with a human agent
- You can use naira symbol (₦) for prices
- Be aware this is a Nigerian market - customers may ask about Jumia/Konga comparisons, local delivery, etc.

## Product Finder Mode (IMPORTANT)
When a customer doesn't know exactly what they want, help them figure it out by asking smart questions:

1. **Budget**: "What's your budget range?" (suggest brackets like under ₦200K, ₦200K-₦500K, ₦500K-₦1M, above ₦1M)
2. **Use case**: "What will you mainly use it for?" (work, school, gaming, business, personal use)
3. **Preferences**: Ask about brand preference, size preference, or must-have features
4. **Narrow down**: Based on answers, recommend 2-3 specific products from the database with prices

Examples of when to activate Product Finder:
- "I need a laptop but don't know which one"
- "What phone should I buy?"
- "I have ₦300K, what can I get?"
- "Help me choose a computer"
- "What do you recommend for a student?"
- "I want something for my office"
- Any vague request where the customer hasn't specified an exact product

When in Product Finder mode:
- Ask ONE question at a time (don't overwhelm them)
- Be conversational, not robotic
- After 2-3 questions, make a recommendation
- Always include price and a brief reason why you're recommending it
- End with "Would you like me to find more options or tell you more about any of these?"
`;

// Search products in the database
async function searchProducts(query: string, limit: number = 5) {
    try {
        const { data, error } = await supabaseAdmin
            .from("products")
            .select("product_name, selling_price, category, image_url, slug")
            .eq("is_active", true)
            .ilike("product_name", `%${query}%`)
            .order("selling_price", { ascending: true })
            .limit(limit);

        if (error) {
            console.error("[Chat] Product search error:", error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("[Chat] Product search exception:", err);
        return [];
    }
}

// Get product categories summary
async function getProductSummary() {
    try {
        const { data, error } = await supabaseAdmin
            .from("products")
            .select("category")
            .eq("is_active", true);

        if (error) return null;

        const categories: Record<string, number> = {};
        data?.forEach((p) => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        return categories;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { messages, sessionId } = await request.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Messages array is required" },
                { status: 400 }
            );
        }

        // Get the latest user message to check if we need product search
        const latestUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

        // Check if user is asking about products - do a search
        let productContext = "";
        const productKeywords = [
            "price", "cost", "how much", "buy", "looking for", "recommend",
            "laptop", "phone", "iphone", "samsung", "macbook", "tablet",
            "generator", "speaker", "headphone", "camera", "printer",
            "available", "stock", "do you have", "sell", "cheapest", "best"
        ];

        const isProductQuery = productKeywords.some(kw => latestUserMessage.includes(kw));

        if (isProductQuery) {
            // Extract potential product search terms
            const searchTerms = latestUserMessage
                .replace(/how much|what is the price|do you have|looking for|i want|i need|can i get|recommend/gi, "")
                .replace(/[?!.,]/g, "")
                .trim();

            if (searchTerms.length > 2) {
                const products = await searchProducts(searchTerms);
                if (products.length > 0) {
                    productContext = "\n\n[PRODUCT SEARCH RESULTS - Share these with the customer]\n";
                    products.forEach((p) => {
                        const price = p.selling_price
                            ? `₦${Number(p.selling_price).toLocaleString()}`
                            : "Price on request";
                        productContext += `- ${p.product_name}: ${price} (Category: ${p.category})\n`;
                    });
                    productContext += "\nNote: Direct the customer to browse the website for full details and images.";
                }
            }
        }

        // Build the messages array for OpenAI
        const systemMessage = {
            role: "system" as const,
            content: STORE_KNOWLEDGE + productContext,
        };

        // Format conversation history (keep last 10 messages for context)
        const conversationHistory = messages.slice(-10).map((msg: { role: string; content: string }) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        }));

        // Call OpenAI GPT-4o-mini
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [systemMessage, ...conversationHistory],
            max_tokens: 500,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
        });

        const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again or contact our support team on WhatsApp.";

        return NextResponse.json({
            message: aiResponse,
            sessionId: sessionId || crypto.randomUUID(),
        });
    } catch (error: any) {
        console.error("[Chat API] Error:", error.message);

        // Handle specific OpenAI errors
        if (error.code === "insufficient_quota") {
            return NextResponse.json(
                { error: "Our AI assistant is temporarily unavailable. Please contact us on WhatsApp: +234 902 725 6852" },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again or reach us on WhatsApp." },
            { status: 500 }
        );
    }
}
