import { getChromeExecutablePath } from "@/lib/api/chrome";
import { WEB_CRAWLING_SEARCH_KEYWORD } from "@/lib/const";
import { handleError } from "@/lib/helpers";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

// 전반적인 리팩토링 필요
export async function GET() {
  try {
    const executablePath = getChromeExecutablePath();
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
    });
    const page = await browser.newPage();

    const posts = [];

    // CERT/CC 취약점 정보 페이지로 이동
    const VULS_URL = "https://www.kb.cert.org/vuls/search/";
    await page.goto(VULS_URL, {
      waitUntil: "domcontentloaded",
      timeout: 40000,
    });

    // 크롤링 키워드 입력
    await page.type("input[name='wordSearch']", WEB_CRAWLING_SEARCH_KEYWORD);

    await new Promise((r) => setTimeout(r, 3000));

    // 최신 게시글을 가져오기 위해 checkbox 클릭
    const Checkbox2024Selector = "input[type='checkbox'][value='2024']";
    const Checkbox2023Selector = "input[type='checkbox'][value='2023']";

    await page.waitForSelector(Checkbox2024Selector);
    await page.waitForSelector(Checkbox2023Selector);

    // 체크박스 상태 확인 및 초기화
    const is2024Checked = await page.$eval(
      Checkbox2024Selector,
      (el) => el.checked,
    );
    if (is2024Checked) {
      await page.click(Checkbox2024Selector);
    }
    await page.click(Checkbox2024Selector);

    await new Promise((r) => setTimeout(r, 1000));

    const is2023Checked = await page.$eval(
      Checkbox2023Selector,
      (el) => el.checked,
    );
    if (is2023Checked) {
      await page.click(Checkbox2023Selector);
    }
    await page.click(Checkbox2023Selector);

    await new Promise((r) => setTimeout(r, 3000));

    // 페이지네이션을 고려하여 게시글 링크 수집
    let hasNextPage = true;
    while (hasNextPage) {
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
          function extractContentBetweenElements(
            startElement: HTMLElement | null,
            endElement: HTMLElement | null,
            tags: string[] = [
              "P",
              "UL",
              "LI",
              "BLOCKQUOTE",
              "H3",
              "H4",
              "STRONG",
            ],
          ): { id: string; text: string }[] {
            if (!startElement) return [];

            let currentElement = startElement.nextElementSibling;
            const content: { id: string; text: string }[] = [];

            while (currentElement && currentElement !== endElement) {
              if (tags.includes(currentElement.tagName)) {
                content.push({
                  id: crypto.randomUUID(),
                  text: currentElement.textContent?.trim() || "",
                });
              }
              currentElement = currentElement.nextElementSibling;
            }

            return content;
          }

          const postTitle = document.querySelector("h2.subtitle");

          const overviewElement = document.querySelector(
            ".blog-post #overview",
          ) as HTMLElement | null;
          const descriptionElement = document.querySelector(
            ".blog-post #description",
          ) as HTMLElement | null;
          const impactElement = document.querySelector(
            ".blog-post #impact",
          ) as HTMLElement | null;
          const solutionElement = document.querySelector(
            ".blog-post #solution",
          ) as HTMLElement | null;
          const acknowledgementsElement = document.querySelector(
            ".blog-post #acknowledgements",
          ) as HTMLElement | null;

          const overviewContent = extractContentBetweenElements(
            overviewElement,
            descriptionElement ||
              impactElement ||
              solutionElement ||
              acknowledgementsElement,
          );

          const descriptionContent = extractContentBetweenElements(
            descriptionElement,
            impactElement || solutionElement || acknowledgementsElement,
          );

          const impactContent = extractContentBetweenElements(
            impactElement,
            solutionElement || acknowledgementsElement,
          );

          const solutionContent = extractContentBetweenElements(
            solutionElement,
            acknowledgementsElement,
          );

          const links = Array.from(
            document.querySelectorAll("#other-information + div a"),
          );

          const cveLinks = links
            .filter((link) =>
              (link as HTMLAnchorElement).innerText
                .toLowerCase()
                .includes("cve"),
            )
            .map((link) => (link as HTMLAnchorElement).innerText);

          const tableDataElements = document.querySelectorAll(
            "#other-information + div td",
          );
          const lastUpdatedAt = Array.from(tableDataElements).find(
            (el) => el.textContent && el.textContent.includes("UTC"),
          );

          /** 문자열(YYYY-MM-DD HH:MM UTC)에서 Firestore의 timestamp 형식으로 변환합니다. */
          const formatStringToTimestamp = (
            dateString: string,
          ): {
            seconds: number;
            nanoseconds: number;
          } => {
            const date = new Date(dateString);
            return {
              seconds: Math.floor(date.getTime() / 1000),
              nanoseconds: date.getMilliseconds() * 1000000,
            };
          };

          let formattedLastUpdatedAt = { seconds: 0, nanoseconds: 0 };
          if (lastUpdatedAt) {
            formattedLastUpdatedAt = formatStringToTimestamp(
              (lastUpdatedAt as HTMLElement).innerText,
            );
          }

          const sourceCreatedAt = document.querySelector("#datefirstpublished");
          let formattedSourceCreatedAt = { seconds: 0, nanoseconds: 0 };
          if (sourceCreatedAt) {
            formattedSourceCreatedAt = formatStringToTimestamp(
              (sourceCreatedAt as HTMLElement).innerText,
            );
          }

          return {
            title: {
              original: postTitle
                ? (postTitle as HTMLElement).innerText
                : "제목을 찾을 수 없습니다.",
              translated: "",
            },
            content: {
              overview: {
                original: overviewContent,
                translated: [],
              },
              description: {
                original: descriptionContent,
                translated: [],
              },
              impact: {
                original: impactContent,
                translated: [],
              },
              solution: {
                original: solutionContent,
                translated: [],
              },
              cveIDs: cveLinks,
            },
            source_updated_at: lastUpdatedAt ? formattedLastUpdatedAt : null,
            source_created_at: sourceCreatedAt
              ? formattedSourceCreatedAt
              : null,
          };
        });

        posts.push({
          id: uuid,
          label: "기타",
          source: "CERT/CC",
          page_url: link,
          created_at: { seconds: 0, nanoseconds: 0 },
          views: 0,
          ...postData,
        });
        await postDetailPage.close();
      }

      const nextPageButton = await page.$("li.pagination-next > a");
      if (nextPageButton) {
        await new Promise((r) => setTimeout(r, 2000));

        await nextPageButton.click();

        await page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 40000,
        });
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        hasNextPage = false;
      }
    }

    await browser.close();
    return NextResponse.json({ posts });
  } catch (error) {
    return handleError(error);
  }
}
