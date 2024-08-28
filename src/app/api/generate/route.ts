import { LLAMA_API_URL } from "@/lib/const";
import { getAPItoken } from "@/lib/api/llama3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. 인증 토큰 획득
    const token = await getAPItoken();

    // 2. 요청 본문 파싱
    const body = await request.json();

    // 3. 필수 필드 검증
    if (
      !body.user_message ||
      typeof body.temperature !== "number" ||
      typeof body.top_p !== "number"
    ) {
      return NextResponse.json(
        { message: "필수 필드 누락 또는 잘못된 형식", body: body },
        { status: 400 },
      );
    }

    // 4. Llama API로 요청 전송
    const generateResponse = await fetch(LLAMA_API_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // prompt 추가 예정
        user_message: body.user_message,
        temperature: body.temperature,
        top_p: body.top_p,
      }),
    });

    // Llama API 응답 처리
    const generateResponseText = await generateResponse.text();

    if (!generateResponse.ok) {
      return NextResponse.json(
        {
          message: "Llama API 오류",
          error: generateResponseText,
        },
        { status: generateResponse.status },
      );
    }

    // 텍스트 응답을 그대로 반환
    return NextResponse.json({
      generated_text: generateResponseText,
    });
  } catch (error) {
    console.error("요청 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "서버 오류", error: String(error) },
      { status: 500 },
    );
  }
}
