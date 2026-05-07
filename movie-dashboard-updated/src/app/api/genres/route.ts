import { NextResponse } from "next/server";
import { getGenres } from "@/db/queries";

export const runtime = "nodejs";

export function GET() {
  try {
    return NextResponse.json({ genres: getGenres() });
  } catch {
    return NextResponse.json({ genres: ["All"] }, { status: 500 });
  }
}
