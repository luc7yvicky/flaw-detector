
import { getChromeExecutablePath } from "@/lib/api/web-crawling";
import puppeteer from "puppeteer-core";

export async function GET() {
  const executablePath = getChromeExecutablePath();

  // Puppeteer로 브라우저 실행
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  // 크롤링할 사이트 URL로 이동
  await page.goto("https://nextjs.org/");

  // 크롤링 코드 작성

  // 브라우저 종료
  await browser.close();
}
