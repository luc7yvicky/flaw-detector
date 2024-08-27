import { NextResponse } from "next/server";

export function handleError(error: unknown) {
  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { message: "An unexpected error occurred" },
    { status: 503 },
  );
}
