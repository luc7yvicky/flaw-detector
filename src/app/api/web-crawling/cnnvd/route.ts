import { getChromeExecutablePath } from "@/lib/api/chrome";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import { VulDBPost } from "@/types/post";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../../../../firebaseConfig";
import { addPost } from "@/lib/api/posts";

async function getGeneratedText(user_message: string) {
  const LOCAL_LLAMA_API_URL = "http://localhost:3000/api/generate";
  const res = await fetch(LOCAL_LLAMA_API_URL, {
    method: "POST",
    body: JSON.stringify({
      user_message,
      temperature: 0.9,
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    console.error("LLaMA API request failed:", res.statusText);
    return null;
  }

  const data = await res.json();
  return data.generated_text;
}

const translateText = async (originalText: string) => {
  if (!originalText) return "";
  const res = await getGeneratedText(
    `다음 텍스트를 한국어로 번역해주세요. url은 제외하고 이어서 번역해주세요. ${originalText}`,
  );
  if (!res) {
    console.error("Translation failed, received undefined");
    return "";
  }
  return res;
};

// Firestore에 데이터가 이미 저장되어 있는지 확인
async function checkIfDataExistsBySourceCreatedAt(
  timestamp: number,
): Promise<boolean> {
  const collectionRef = collection(db, "posts");
  const q = query(
    collectionRef,
    where("source_created_at.seconds", "==", timestamp),
  );
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty; // 동일한 데이터가 있으면 true
}

export async function GET() {
  const executablePath = getChromeExecutablePath();

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
  });
  const page = await browser.newPage();

  const CNNVD_URL = "https://www.cnnvd.org.cn/home/warn";
  await page.goto(CNNVD_URL, { waitUntil: "networkidle0", timeout: 120000 });

  await page.waitForSelector("p.content-title", {
    timeout: 20000,
  });

  const crawledData: VulDBPost[] = [];

  async function crawlDetails(startIndex: number) {
    const elements = await page.$$("p.content-title");

    if (startIndex >= elements.length) {
      return "done";
    }

    // 페이지 리로드 후 요소 다시 참조
    const refreshedElement = elements[startIndex];

    if (!refreshedElement) {
      console.log("인덱스", startIndex, "에 해당하는 요소를 찾을 수 없습니다.");
      return "done";
    }

    await new Promise((r) => setTimeout(r, 2000));
    await refreshedElement.click();
    await new Promise((r) => setTimeout(r, 2000));

    await page.waitForSelector("p.detail-title", {
      visible: true,
      timeout: 120000,
    });

    // 상세 페이지의 데이터 크롤링
    const detailTitle = await page.$eval("p.detail-title", (el) =>
      el.textContent?.trim(),
    );

    const detailSubtitle = await page.$eval("div.detail-subtitle", (el) =>
      el.textContent?.trim(),
    );

    //날짜만 추출
    let sourceCreatedAtTimestamp = 0;
    if (detailSubtitle && detailSubtitle.includes("发布时间：")) {
      const dateString = detailSubtitle.replace("发布时间：", "").trim();
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        sourceCreatedAtTimestamp = parsedDate.getTime() / 1000;
      } else {
        console.error("Invalid date format:", dateString);
      }
    }

    const sourceYear = new Date(sourceCreatedAtTimestamp * 1000).getFullYear();
    if (sourceYear !== 2023 && sourceYear !== 2024) {
      return false;
    }

    // Firestore에 이미 저장되어 있는지 확인
    const exists = await checkIfDataExistsBySourceCreatedAt(
      sourceCreatedAtTimestamp,
    );
    if (exists) {
      return true;
    }

    const content = await page.evaluate(() => {
      const paragraphs = document.querySelectorAll(
        "div.detail-content > p.MsoNormal, div.detail-content > pre, div.detail-content > font, div.detail-content > p.\\32,  div.detail-content > p, div.detail-content > h2, div.detail-content > p.MsoNormalCxSpFirst",
      );
      let description = "";
      let introduction = "";
      let vulnDetail = "";
      let remediation = "";

      let section = "description";
      let skipNextP = false;

      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || "";

        if (p.tagName === "TABLE" && p.classList.contains("MsoTableGrid")) {
          skipNextP = true;
          return;
        }

        if (skipNextP && p.className === "") {
          return;
        } else if (p.className !== "") {
          skipNextP = false;
        }

        if (text.startsWith("一、")) {
          section = "introduction";
          introduction += text + "\n";
          return;
        } else if (text.startsWith("二、")) {
          section = "vulnDetail";
          vulnDetail += text + "\n";
          return;
        } else if (text.startsWith("三、")) {
          section = "remediation";
          remediation += text + "\n";
          return;
        }
        if (section === "description") {
          description += text + "\n";
        } else if (section === "introduction") {
          introduction += text + "\n";
        } else if (section === "vulnDetail") {
          vulnDetail += text + "\n";
        } else if (section === "remediation") {
          remediation += text + "\n";
        }
      });

      return {
        description: { original: description.trim(), translated: "" },
        introduction: { original: introduction.trim(), translated: "" },
        vulnDetail: { original: vulnDetail.trim(), translated: "" },
        remediation: { original: remediation.trim(), translated: "" },
      };
    });

    await page.waitForSelector("div.el-page-header__title", { timeout: 3000 });
    await page.click("div.el-page-header__title");

    const newCrawledData: VulDBPost = {
      id: crypto.randomUUID(),
      label: "취약성 보고서",
      source: "CNNVD",
      page_url: CNNVD_URL,
      views: 0,
      title: {
        original: detailTitle || "제목을 찾을 수 없습니다.",
        translated: (await translateText(detailTitle || "")) || "",
      },
      created_at: {
        seconds: 0,
        nanoseconds: 0,
      },
      source_created_at: {
        seconds: sourceCreatedAtTimestamp,
        nanoseconds: 0,
      },
      content: {
        description: {
          original: content.description.original,
          translated: (await translateText(content.description.original)) || "",
        },
        introduction: {
          original: content.introduction.original,
          translated:
            (await translateText(content.introduction.original)) || "",
        },
        vulnDetail: {
          original: content.vulnDetail.original,
          translated: (await translateText(content.vulnDetail.original)) || "",
        },
        remediation: {
          original: content.remediation.original,
          translated: (await translateText(content.remediation.original)) || "",
        },
      },
    };

    crawledData.push(newCrawledData);
    await addPost(newCrawledData);
    return true; // 크롤링 계속 진행
  }

  async function handlePagination() {
    let hasNextPage = true;

    while (hasNextPage) {
      let startIndex = 0;
      let hasMoreItems = true;

      // 현재 페이지의 모든 요소를 처리
      while (hasMoreItems) {
        const result = await crawlDetails(startIndex);
        if (!result) {
          hasMoreItems = false; // 2024년, 2023년이 아닌 연도 발견 시 중단
        } else if (result === "done") {
          break; // 현재 페이지의 모든 요소가 처리되면 루프 종료
        } else {
          startIndex++;
        }
      }

      const nextPageButton = await page.$("li.number.active + li.number");
      if (nextPageButton) {
        await new Promise((r) => setTimeout(r, 2000));

        const previousContent = await page.content();

        await page.evaluate((el) => el.click(), nextPageButton);
        await new Promise((r) => setTimeout(r, 2000));

        try {
          await page.waitForFunction(
            (prevContent) => document.body.innerHTML !== prevContent,
            { timeout: 120000 },
            previousContent,
          );
        } catch (error) {
          hasNextPage = false;
          continue;
        }

        // 새 페이지 로드 후 다시 요소 처리 시작
        await page.waitForSelector("p.content-title", { timeout: 120000 });
      } else {
        hasNextPage = false;
      }
    }
  }

  await handlePagination();
  await browser.close();

  return NextResponse.json({
    message: "Data saved to Firestore",
    crawledData,
  });
}
