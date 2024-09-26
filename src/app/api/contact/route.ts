import {
  EMAIL_VALIDATION_MESSAGE,
  MESSAGE_VALIDATION_MESSAGE,
  NAME_VALIDATION_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from "@/lib/const";
import { sendEmail } from "@/lib/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (
    typeof name !== "string" ||
    name.includes(" ") ||
    name.trim().length < 2
  ) {
    return NextResponse.json({
      message: NAME_VALIDATION_MESSAGE,
      status: 400,
    });
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return NextResponse.json({
      message: EMAIL_VALIDATION_MESSAGE,
      status: 400,
    });
  }

  if (typeof message !== "string" || message.trim().length < 5) {
    return NextResponse.json({
      message: MESSAGE_VALIDATION_MESSAGE,
      status: 400,
    });
  }

  try {
    await sendEmail(name.trim(), email.trim(), message.trim());
    return NextResponse.json({ message: "SUCCESS", status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({
      message: SERVER_ERROR_MESSAGE,
      status: 500,
    });
  }
}
