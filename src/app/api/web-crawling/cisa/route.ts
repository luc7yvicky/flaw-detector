import os from "os";
import puppeteer from "puppeteer-core";

/** 운영체제별로 Chrome 실행 파일 경로 찾기 */
export const getChromeExecutablePath = () => {
  const platform = os.platform();
  if (platform === "win32") {
    // Windows
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  } else if (platform === "darwin") {
    // macOS
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (platform === "linux") {
    // Linux
    return "/usr/bin/google-chrome";
  } else if (platform === "freebsd") {
    // FreeBSD
    return "/usr/local/bin/google-chrome";
  } else {
    throw new Error(`지원하지 않는 운영체제: ${platform}`);
    // 문제가 발생할 경우 대안책: chrome-launcher 라이브러리 (Chrome 실행 파일 경로 자동 설정 가능)
  }
};

export async function GET() {
  const executablePath = getChromeExecutablePath();

  // Puppeteer로 브라우저 실행
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  // 크롤링할 사이트 URL로 이동
  await page.goto("");

  // 크롤링 코드 작성

  // 브라우저 종료
  await browser.close();
}
