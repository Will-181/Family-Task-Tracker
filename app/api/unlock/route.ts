import { NextRequest, NextResponse } from "next/server";
import { createSignedCookie, getCookieHeader } from "@/lib/cookie";
import { unlockSchema } from "@/lib/validations/unlock";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = unlockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const passcode = process.env.FAMILY_PASSCODE;
    if (!passcode) {
      return NextResponse.json(
        { error: "Server not configured for passcode" },
        { status: 500 }
      );
    }

    if (parsed.data.passcode !== passcode) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const signed = await createSignedCookie();
    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", getCookieHeader(signed));
    return response;
  } catch (err) {
    console.error("Unlock error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
