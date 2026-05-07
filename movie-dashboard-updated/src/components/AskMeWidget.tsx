"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardResponse, ChartFilters } from "@/lib/types";

type Message = { role: "assistant" | "user"; text: string };

type Props = {
  dashboardData: DashboardResponse;
  filters: ChartFilters;
};

const SUGGESTIONS = [
  "What's the top rated genre?",
  "How many movies are in Drama?",
  "Which year had the best ratings?",
];

export function AskMeWidget({ dashboardData, filters }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! Ask me anything about the current dashboard data." },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, dashboardData, filters }),
      });
      const data = (await res.json()) as { answer: string };
      setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed z-[9999] flex flex-col items-end gap-3

        bottom-4
        left-1/2 -translate-x-1/2

        sm:left-auto sm:right-5 sm:translate-x-0
      "
    >
      {/* CHAT WINDOW */}
      {open && (
        <Card className="w-[90vw] max-w-sm overflow-hidden shadow-2xl border border-gray-700 bg-gray-900 text-white">
          
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-gray-700 px-4 py-3 bg-gray-900">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold">Ask About Dashboard</span>
              <Badge className="text-[10px] bg-gray-700 text-white">AI</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-64 space-y-3 overflow-y-auto p-4 text-sm bg-gray-900">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-blue-700 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-700 text-white rounded-tr-sm"
                        : "bg-gray-800 text-gray-200 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-gray-800 px-3 py-2">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-gray-700 px-4 py-2 bg-gray-900">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-gray-600 px-2.5 py-1 text-xs text-gray-300 hover:border-blue-500 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 border-t border-gray-700 p-3 bg-gray-900">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask a question…"
                disabled={loading}
                className="h-8 text-xs bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 bg-blue-700 hover:bg-blue-600"
                onClick={() => send()}
                disabled={loading || !input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BUTTON */}
      <Button
        onClick={() => setOpen((v) => !v)}
        className="
          h-11 px-4 rounded-full shadow-lg flex items-center gap-2
          bg-blue-800 hover:bg-blue-700 text-white
          max-w-[90vw]
        "
      >
        {open ? (
          <>
            <X className="h-4 w-4" />
            Close
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            Ask me!
          </>
        )}
      </Button>
    </div>
  );
}