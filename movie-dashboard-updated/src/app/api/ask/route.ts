import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const MODEL = process.env.ASK_MODEL ?? "gemini-2.0-flash";

export async function POST(req: NextRequest) {
  try {
    const { question, dashboardData, filters } = await req.json() as {
      question: string;
      dashboardData: unknown;
      filters: unknown;
    };

    const systemPrompt = `You are a helpful data analyst assistant for a Movie Analytics Dashboard.
You answer questions about the currently displayed movie data clearly and concisely.
Always be specific — reference actual numbers from the data. Keep answers to 1-3 sentences.
Current filters: ${JSON.stringify(filters)}
Current dashboard data: ${JSON.stringify(dashboardData)}`;

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 256,
    });

    const answer = response.choices[0]?.message?.content ?? "I couldn't generate a response.";
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("ask api error:", error);
    return NextResponse.json(
      { answer: "Sorry, I couldn't connect to the AI service. Check your GEMINI_API_KEY." },
      { status: 500 }
    );
  }
}
