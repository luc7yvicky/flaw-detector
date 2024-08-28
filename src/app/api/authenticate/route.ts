import { getAPItoken } from "@/lib/api/llama3";
import { handleError } from "@/lib/helpers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const token = await getAPItoken();
    return NextResponse.json({ access_token: token });
  } catch (error) {
    return handleError(error);
  }
}
