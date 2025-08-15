import { NextResponse } from "next/server";
import { registerUser } from "@/actions/authActions";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    await registerUser(formData);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "register failed" },
      { status: 400 }
    );
  }
}
