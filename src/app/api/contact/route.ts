import {
  EMAIL_VALIDATION_MESSAGE,
  MESSAGE_VALIDATION_MESSAGE,
  NAME_VALIDATION_MESSAGE,
  SERVER_ERROR_MESSAGE,
} from "@/lib/const";
import { sendEmail } from "@/lib/contact";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: NAME_VALIDATION_MESSAGE })
    .refine((name) => !name.includes(" "), {
      message: NAME_VALIDATION_MESSAGE,
    }),
  email: z.string().email({ message: EMAIL_VALIDATION_MESSAGE }),
  message: z.string().min(5, { message: MESSAGE_VALIDATION_MESSAGE }),
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  const validationResult = contactSchema.safeParse({ name, email, message });

  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors[0]?.message;

    return NextResponse.json({
      message: errorMessage,
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
