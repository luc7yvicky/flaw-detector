import { NextRequest, NextResponse } from "next/server";
import { API_URL, PASSWORD, USERNAME } from "@/lib/const";

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    // 인증 진행
    const authReq = await fetch(API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    });

    if (!authReq.ok) {
      return NextResponse.json(
        { message: "인증 실패" },
        { status: authReq.status },
      );
    }

    const authData = await authReq.json();
    const token = authData.access_token;

    // 데이터 생성 요청
    const genResponse = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await req.json()), // req.body 대신 req.json()을 사용해 Body를 파싱
    });

    if (!genResponse.ok) {
      return NextResponse.json(
        { message: "요청 실패" },
        { status: genResponse.status },
      );
    }

    const data = await genResponse.json();
    return NextResponse.json(data, { status: 200 });
  } else {
    return NextResponse.json(
      { message: `Method ${req.method} Not Allowed` },
      { status: 405 },
    );
  }
}
