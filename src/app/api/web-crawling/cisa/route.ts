import { getChromeExecutablePath } from "@/lib/api/chrome";
import { handleError } from "@/lib/helpers";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export async function GET() {
  try {
    const executablePath = getChromeExecutablePath();

    // Puppeteer로 브라우저 실행
    const browser = await puppeteer.launch({
      executablePath,
      headless: false,
    });

    const page = await browser.newPage();

    // 크롤링할 사이트 URL로 이동
    await page.goto("");

    // 크롤링 코드 작성

    // 브라우저 종료
    await browser.close();

    return NextResponse.json({ message: "크롤링 완료" });
  } catch (error) {
    return handleError(error);
  }
}
