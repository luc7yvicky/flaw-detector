import { getChromeExecutablePath } from "@/lib/api/chrome";
import { WEB_CRAWLING_SEARCH_KEYWORD } from "@/lib/const";
import { handleError } from "@/lib/helpers";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export async function GET() {
  try {
    const executablePath = getChromeExecutablePath();
    const browser = await puppeteer.launch({
      executablePath,
      headless: false,
    });
    const page = await browser.newPage();

    const posts = [];

    // vuls 페이지로 이동
    const VULS_URL = "https://www.kb.cert.org/vuls/";
    await page.goto(VULS_URL, {
      waitUntil: "domcontentloaded",
      timeout: 40000,
    });

    // 페이지 검색창에 크롤링할 키워드 입력
    await page.type("input[name='searchbar']", WEB_CRAWLING_SEARCH_KEYWORD);

    // 검색 버튼 클릭
    const searchButtonSelector = "input[name='searchbar'] + button";
    await page.waitForSelector(searchButtonSelector);
    await page.click(searchButtonSelector);

    // 검색 결과 페이지 로딩 대기
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // 최신 게시글을 가져오기 위해 checkbox 클릭
    const Checkbox2024Selector = "input[type='checkbox'][value='2024']";
    const Checkbox2023Selector = "input[type='checkbox'][value='2023']";

    await page.waitForSelector(Checkbox2024Selector);
    await page.waitForSelector(Checkbox2023Selector);

    await page.click(Checkbox2024Selector);
    await page.click(Checkbox2023Selector);

    await new Promise((r) => setTimeout(r, 3000));

    // 게시글 링크 수집
    const postLinks = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(".vulnerability-list h4 a"),
      );
      return links.map((link) => (link as HTMLAnchorElement).href);
    });

    // 각 게시물 링크를 방문하여 내용 크롤링
    for (let link of postLinks) {
      const postDetailPage = await browser.newPage();
      await postDetailPage.goto(link, { waitUntil: "networkidle2" });

      const uuid = crypto.randomUUID(); // 변경 예정

      const postData = await postDetailPage.evaluate(() => {
        const postTitle = document.querySelector("h2.subtitle");

        const paragraphElements = Array.from(
          document.querySelectorAll("div.blog-post p"),
        );
        const content = paragraphElements.map((p) => ({
          text: (p as HTMLElement).innerText,
          block_id: crypto.randomUUID(),
        }));

        return {
          title: postTitle
            ? (postTitle as HTMLElement).innerText
            : "내용을 찾을 수 없습니다.",
          content,
        };
      });

      posts.push({
        id: uuid,
        label: "기타",
        source: "CERT/CC",
        page_url: link,
        created_at: { seconds: Date.now() / 1000, nanoseconds: 0 },
        ...postData,
      });
      await postDetailPage.close();
    }

    // 브라우저 종료
    await browser.close();
    return NextResponse.json({ posts });
  } catch (error) {
    return handleError(error);
  }
}
