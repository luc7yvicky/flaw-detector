import { NextRequest, NextResponse } from "next/server";
import { AUTH_URL, PASSWORD, USERNAME } from "@/lib/const";

export async function handler(req: NextRequest) {
  if (req.method === "POST") {
    const authResponse = await fetch(AUTH_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      return NextResponse.json(
        { message: "인증 실패" },
        { status: authResponse.status },
      );
    }

    const authData = await authResponse.json();
    return NextResponse.json(authData, { status: 200 });
  } else {
    return NextResponse.json(
      { message: `Method ${req.method} Not Allowed` },
      { status: 405 },
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
