import { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

/**
 * Auth0's middleware handles the /auth/* routes and session cookies.
 * Individual protected pages/API routes perform the final authorization check.
 * This avoids redirect loops and keeps the marketing/contact pages public.
 */
export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
