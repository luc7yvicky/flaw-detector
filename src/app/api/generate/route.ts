import { getAPItoken } from "@/lib/api/llama3";
import { LLAMA_API_URL } from "@/lib/const";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = await getAPItoken();

    const body = await request.json();
    const { user_message, temperature, top_p } = body;

    if (
      !user_message ||
      typeof temperature !== "number" ||
      typeof top_p !== "number"
    ) {
      return NextResponse.json(
        { message: "필수 필드 누락 또는 잘못된 형식" },
        { status: 400 },
      );
    }

    const generateResponse = await fetch(LLAMA_API_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_message, temperature, top_p }),
    });

    const generateResponseText = await generateResponse.text();

    if (!generateResponse.ok) {
      return NextResponse.json(
        { message: "Llama API 오류", error: generateResponseText },
        { status: generateResponse.status },
      );
    }

    return NextResponse.json({ generated_text: generateResponseText });
  } catch (error) {
    console.error("요청 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "서버 오류", error: String(error) },
      { status: 500 },
    );
  }
}
