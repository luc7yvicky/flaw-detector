import * as logger from "firebase-functions/logger";
import { v4 as uuidv4 } from "uuid";
import { initBrowser } from "./config";
import { WEB_CRAWLING_CERT_CC_URL, WEB_CRAWLING_SEARCH_KEYWORD } from "./const";
import { checkIfCrawlingDataExists } from "./firebase";

export const startCertCCWebCrawling = async () => {
  const browser = await initBrowser();
  const page = await browser.newPage();

  const posts = [];

  await page.goto(WEB_CRAWLING_CERT_CC_URL, {
    waitUntil: "domcontentloaded",
    timeout: 40000,
  });

  // 크롤링 키워드 입력
  await page.type("input[name='wordSearch']", WEB_CRAWLING_SEARCH_KEYWORD);

  await new Promise((r) => setTimeout(r, 3000));

  // checkbox 클릭
  const Checkbox2024Selector = "input[type='checkbox'][value='2024']";

  await page.waitForSelector(Checkbox2024Selector);

  // checkbox 상태 확인 및 초기화
  const is2024Checked = await page.$eval(
    Checkbox2024Selector,
    (el) => (el as HTMLInputElement).checked,
  );
  if (is2024Checked) {
    await page.click(Checkbox2024Selector);
  }
  await page.click(Checkbox2024Selector);

  await new Promise((r) => setTimeout(r, 2000));

  // 페이지네이션을 고려하여 게시글 링크 수집
  let hasNextPage = true;

  while (hasNextPage) {
    const postLinks = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(".vulnerability-list h4 a"),
      );
      return links.map((link) => (link as HTMLAnchorElement).href);
    });

    // 수집된 링크 중 Firestore에 이미 존재하는 데이터 필터링
    for (let link of postLinks) {
      const isStored = await checkIfCrawlingDataExists(link);
      if (isStored) {
        // logger.info(`이미 저장된 데이터입니다. 링크: ${link}`);
        continue;
      }

      const postDetailPage = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await postDetailPage.goto(link, {
        timeout: 0,
        waitUntil: "domcontentloaded",
      });

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
                id: "",
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
            (link as HTMLAnchorElement).innerText.toLowerCase().includes("cve"),
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
          source_created_at: sourceCreatedAt ? formattedSourceCreatedAt : null,
        };
      });

      postData.content.overview.original =
        postData.content.overview.original.map((item) => ({
          id: uuidv4(),
          text: item.text,
        }));
      postData.content.description.original =
        postData.content.description.original.map((item) => ({
          id: uuidv4(),
          text: item.text,
        }));
      postData.content.impact.original = postData.content.impact.original.map(
        (item) => ({
          id: uuidv4(),
          text: item.text,
        }),
      );
      postData.content.solution.original =
        postData.content.solution.original.map((item) => ({
          id: uuidv4(),
          text: item.text,
        }));

      posts.push({
        id: uuidv4(),
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
      try {
        await Promise.all([nextPageButton.click(), page.waitForNavigation()]);
      } catch (error: any) {
        logger.error(`페이지 네비게이션 오류: ${error.message}`);
        console.error("Navigation error:", error.message);
      }

      await new Promise((r) => setTimeout(r, 2000));
    } else {
      hasNextPage = false;
      logger.info("더 이상 페이지가 없습니다.");
    }
  }

  logger.info(`크롤링 완료. 총 ${posts.length}개의 게시물을 수집했습니다.`);

  await browser.close();
  return posts;
};
