import { NextResponse } from "next/server";
import { loginUser } from "@/actions/authActions";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const r = await loginUser(formData);
    // Set cookie server-side — NextResponse cookie API:
    const res = NextResponse.json({ ok: true, user: r.user });
    res.cookies.set({
      name: "wkt3_session",
      value: r.token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "login failed" },
      { status: 400 }
    );
  }
}
