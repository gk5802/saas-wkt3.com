import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../lib/auth";

export const config = { matcher: ["/((?!api|_next|public|auth).*)"] };

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("wkt3_session")?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  const info = verifySessionToken(
    cookie,
    process.env.NEXTAUTH_SECRET || "secret"
  );
  if (!info) {
    // invalid session, redirect to login
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  // session OK — let request pass
  return NextResponse.next();
}
