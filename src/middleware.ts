// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Required for getToken to decrypt the cookie
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  console.log("secret", secret);
  console.log("Cookies:", req.cookies.getAll());
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  const token = await getToken({ req, secret });

  // Log for debugging
  console.log("TOKEN FROM middleware:", token);

  // If token doesn't exist, redirect to login
  if (!token) {
    // const loginUrl = new URL("/login", req.url);
    // return NextResponse.redirect(loginUrl);
  }

  // Allow request to continue
  return NextResponse.next();
}

// Protect all routes except those listed
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
