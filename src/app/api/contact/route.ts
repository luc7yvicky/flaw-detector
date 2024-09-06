import { sendEmail, transporter } from "@/lib/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email") || process.env.NODEMAILER_SENDER;
  const message = formData.get("message");

  try {
    await sendEmail(name as string, email as string, message as string);

    return NextResponse.json({ message: "문의를 보냈어요!" });
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "COULD NOT SEND MESSAGE" });
  }
}
