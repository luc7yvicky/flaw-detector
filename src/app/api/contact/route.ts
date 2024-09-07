import { sendEmail } from "@/lib/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email") || process.env.NODEMAILER_SENDER;
  const message = formData.get("message");

  // 유효성 검사 (name: 2자 이상, email: email형식, message: 5자 이상)
  if (typeof name !== "string" || name.length < 2) {
    return NextResponse.json({ message: "INVALID NAME", status: 400 });
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (typeof email !== "string" || !emailPattern.test(email)) {
    return NextResponse.json({ message: "INVALID EMAIL", status: 400 });
  }

  if (typeof message !== "string" || message.length < 5) {
    return NextResponse.json({ message: "INVALID MESSAGE", status: 400 });
  }

  try {
    await sendEmail(name as string, email as string, message as string);

    return NextResponse.json({ message: "SUCCESS", status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({
      message: "FAILED TO SEND MESSAGE",
      status: 500,
    });
  }
}
