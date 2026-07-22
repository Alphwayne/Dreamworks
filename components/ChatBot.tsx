"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, User, Loader2, UserCircle } from "lucide-react";

// Custom DreamGuide icon — a compass/guide symbol
function DreamGuideIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <path d="M9.5 14.5l-1-6 6-1-1 6-4 1z" fill="currentColor" opacity="0.9" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
        </svg>
    );
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
    "What products do you sell?",
    "Help me find the right laptop",
    "I have a budget, what can I get?",
    "Do you deliver nationwide?",
    "How do DreamPoints work?",
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const [showHandoff, setShowHandoff] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Generate session ID on mount
    useEffect(() => {
        setSessionId(crypto.randomUUID());
    }, []);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Add welcome message when chat first opens
    const handleOpen = useCallback(() => {
        setIsOpen(true);
        if (messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content: "Hi there! I'm DreamGuide, your personal shopping companion. Whether you know exactly what you want or need help figuring it out — I'm here. Ask me about products, pricing, delivery, or let me help you find the perfect tech for your needs.",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [messages.length]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Build message history for API
            const apiMessages = [...messages, userMessage].map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    sessionId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const aiMessage: Message = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data.message,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);

                // Update session ID if returned
                if (data.sessionId) setSessionId(data.sessionId);
            } else {
                const errorMessage: Message = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data.error || "Sorry, something went wrong. Please try again or reach us on WhatsApp.",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch {
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Connection error. Please check your internet and try again, or contact us on WhatsApp: +234 902 725 6852",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleSuggestionClick = (question: string) => {
        sendMessage(question);
    };

    const handleHandoff = () => {
        setShowHandoff(true);
        const handoffMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "I'll connect you with a human agent. You can reach our team directly on WhatsApp for immediate assistance:\n\n📱 WhatsApp: +234 902 725 6852\n\nOur support hours are Mon-Fri 8am-6pm, Sat 9am-4pm. They'll be happy to help with your specific needs!",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, handoffMessage]);
    };

    return (
        <>
            {/* ── FLOATING CHAT BUTTON ── */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    title="Chat with DreamGuide"
                    className="fixed bottom-5 right-3 sm:bottom-5 sm:right-4 z-50 flex items-center gap-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white px-3 py-2.5 rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105 hover:-translate-y-0.5 group"
                >
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <DreamGuideIcon size={18} className="text-white" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold leading-none">DreamGuide</p>
                        <p className="text-[10px] text-blue-100 leading-none mt-0.5">Your shopping companion</p>
                    </div>
                    <div className="text-left block sm:hidden">
                        <p className="text-xs font-bold leading-none">Guide</p>
                    </div>
                    {/* Pulse indicator */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </button>
            )}

            {/* ── CHAT WINDOW ── */}
            {isOpen && (
                <div className="fixed z-50 inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[380px] sm:h-[560px] flex flex-col bg-white sm:rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <DreamGuideIcon size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">DreamGuide</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    <p className="text-blue-100 text-xs">Online • Shopping Companion</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <DreamGuideIcon size={14} className="text-blue-600" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                        msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <User size={14} className="text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <DreamGuideIcon size={14} className="text-blue-600" />
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Questions (show only when few messages) */}
                    {messages.length <= 1 && !isLoading && (
                        <div className="px-4 py-2 border-t border-gray-100 bg-white flex-shrink-0">
                            <p className="text-xs text-gray-400 font-medium mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {SUGGESTED_QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(q)}
                                        className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Human Handoff Button */}
                    {messages.length > 3 && !showHandoff && (
                        <div className="px-4 py-1.5 bg-white border-t border-gray-100 flex-shrink-0">
                            <button
                                onClick={handleHandoff}
                                className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-blue-600 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <UserCircle size={14} />
                                Talk to a human agent
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <form
                        onSubmit={handleSubmit}
                        className="px-3 py-3 border-t border-gray-200 bg-white flex items-center gap-2 flex-shrink-0"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1 bg-gray-100 text-sm text-gray-800 placeholder-gray-400 px-4 py-2.5 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50"
                            style={{ fontSize: "16px" }} // Prevent iOS zoom
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
