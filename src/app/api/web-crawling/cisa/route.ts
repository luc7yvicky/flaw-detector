import { handleError } from "@/lib/helpers";
import Chromium from "@sparticuz/chromium";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export async function GET() {
  try {
    // Puppeteer로 브라우저 실행
    const browser = await puppeteer.launch({
      executablePath: await Chromium.executablePath(),
      headless: true,
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
