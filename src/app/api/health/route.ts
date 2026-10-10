import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "SecureChat AI",
    timestamp: new Date().toISOString(),
    storage: process.env.SUPABASE_URL ? "supabase" : "local-json",
    email: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL),
    fga: Boolean(process.env.FGA_STORE_ID),
    ai: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  });
}
