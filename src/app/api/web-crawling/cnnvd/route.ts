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

// import { getChromeExecutablePath } from "@/lib/api/chrome";
// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer-core";
// import { CnnvdLocalizedTextBlock, CnnvdTextBlock } from "@/types/type";

// type CNNVDData = {
//   id: string;
//   label: string;
//   source: string;
//   page_url: string;
//   title: {
//     original: CnnvdTextBlock;
//     translated: [];
//   };
//   created_at: {
//     seconds: number;
//     nanoseconds: number;
//   };
//   source_created_at: { seconds: number; nanoseconds: number };
//   content: {
//     description: CnnvdLocalizedTextBlock;
//     introduction: CnnvdLocalizedTextBlock;
//     vulnDetail: CnnvdLocalizedTextBlock;
//     remediation: CnnvdLocalizedTextBlock;
//   };
// };

// export async function GET() {
//   const executablePath = getChromeExecutablePath();

//   const browser = await puppeteer.launch({
//     executablePath,
//     headless: true,
//   });
//   const page = await browser.newPage();

//   const CNNVD_URL = "https://www.cnnvd.org.cn/home/warn";
//   await page.goto(CNNVD_URL, { waitUntil: "networkidle0", timeout: 120000 });

//   await page.waitForSelector("p.content-title", {
//     timeout: 20000,
//   });

//   const crawledData: CNNVDData[] = [];

//   async function crawlDetails(startIndex = 0) {
//     const elements = await page.$$("p.content-title");

//     if (elements.length === 0 || startIndex >= elements.length) {
//       return;
//     }

//     const dateText = await page.$eval(
//       "div.content-detail",
//       (el) => el.textContent?.trim() || "",
//     );

//     const year = dateText?.split("-")[0];

//     if (!["2024"].includes(year)) {
//       console.log(`크롤링 종료: ${year}년도의 게시물은 크롤링 하지 않음.`);
//       return;
//     }

//     // 페이지 리로드 후 요소 다시 참조
//     const refreshedElement = (await page.$$("p.content-title"))[startIndex];

//     if (!refreshedElement) {
//       await crawlDetails(startIndex + 1);
//       return;
//     }

//     await new Promise((r) => setTimeout(r, 2000));

//     await refreshedElement.click();
//     console.log(`Clicking on element at index: ${startIndex}`); // 확인용 추후 삭제 예정

//     await new Promise((r) => setTimeout(r, 2000));

//     await page.waitForSelector("p.detail-title", {
//       visible: true,
//       timeout: 120000,
//     });

//     // 상세 페이지의 데이터 크롤링
//     const detailTitle = await page.$eval("p.detail-title", (el) =>
//       el.textContent?.trim(),
//     );

//     console.log(`Crawled Title: ${detailTitle || "제목을 찾을 수 없습니다."}`);

//     // CnnvdContent 추출
//     const content = await page.evaluate(() => {
//       const paragraphs = document.querySelectorAll(
//         "div.detail-content > p.MsoNormal, div.detail-content > pre, div.detail-content > font",
//       );
//       let description = "";
//       let introduction = "";
//       let vulnDetail = "";
//       let remediation = "";

//       let section = "description";
//       let skipNextP = false; //table 이후 나오는 p태그 스킵하기 위한 플래그

//       paragraphs.forEach((p) => {
//         const text = p.textContent?.trim() || "";

//         // <table class="MsoTableGrid">가 등장하면 그 이후의 <p> 태그 스킵
//         if (p.tagName === "TABLE" && p.classList.contains("MsoTableGrid")) {
//           skipNextP = true;
//           return;
//         }

//         if (skipNextP && p.className === "") {
//           // 테이블 바로 다음에 있는 클래스가 없는 <p> 태그는 무시
//           return;
//         } else if (p.className !== "") {
//           skipNextP = false; // 다시 <p class="MsoNormal">이므로 처리할 수 있도록 설정
//         }

//         if (text.startsWith("一、")) {
//           section = "introduction";
//           introduction += text + "\n";
//           return;
//         } else if (text.startsWith("二、")) {
//           section = "vulnDetail";
//           vulnDetail += text + "\n";
//           return;
//         } else if (text.startsWith("三、")) {
//           section = "remediation";
//           remediation += text + "\n";
//           return;
//         }
//         if (section === "description") {
//           description += text + "\n";
//         } else if (section === "introduction") {
//           introduction += text + "\n";
//         } else if (section === "vulnDetail") {
//           vulnDetail += text + "\n";
//         } else if (section === "remediation") {
//           remediation += text + "\n";
//         }
//       });

//       return {
//         description: { original: description.trim(), translated: "" },
//         introduction: { original: introduction.trim(), translated: "" },
//         vulnDetail: { original: vulnDetail.trim(), translated: "" },
//         remediation: { original: remediation.trim(), translated: "" },
//       };
//     });

//     await page.waitForSelector("div.el-page-header__title", { timeout: 3000 });
//     await page.click("div.el-page-header__title");

//     crawledData.push({
//       id: crypto.randomUUID(),
//       label: "CNNVD",
//       source: "CNNVD",
//       page_url: await page.url(),
//       title: {
//         original: { text: detailTitle || "제목을 찾을 수 없습니다." },
//         translated: [],
//       },
//       created_at: {
//         seconds: Math.floor(new Date().getTime() / 1000),
//         nanoseconds: 0,
//       },
//       source_created_at: {
//         seconds: dateText ? new Date(dateText).getTime() / 1000 : 0,
//         nanoseconds: 0,
//       },
//       content: content,
//     });

//     // 모든 작업이 완료된 후 재귀 호출로 다음 요소를 크롤링
//     await crawlDetails(startIndex + 1);
//   }

//   //페이지네이션 처리
//   async function handlePagination() {
//     let hasNextPage = true;

//     while (hasNextPage) {
//       await crawlDetails(); // 현재 페이지 크롤링

//       // 다음 페이지로 이동
//       const nextPageButton = await page.$("li.number.active + li.number");
//       if (nextPageButton) {
//         console.log("Moving to the next page..."); //확인 로그 (추후삭제예정)

//         await new Promise((r) => setTimeout(r, 2000));

//         // 클릭 전 페이지의 특정 요소를 저장
//         const previousContent = await page.content();

//         // 버튼 클릭 후 페이지 전환을 시도
//         await page.evaluate((el) => el.click(), nextPageButton);

//         await new Promise((r) => setTimeout(r, 2000));

//         // 새로운 콘텐츠가 로드될 때까지 대기
//         try {
//           await page.waitForFunction(
//             (prevContent) => document.body.innerHTML !== prevContent,
//             { timeout: 120000 },
//             previousContent,
//           );
//         } catch (error) {
//           console.error("Page did not navigate within the timeout period.");
//           hasNextPage = false;
//           continue;
//         }

//         await page.waitForSelector("p.content-title", { timeout: 120000 });

//         await crawlDetails();
//       } else {
//         console.log("No more pages to crawl.");
//         hasNextPage = false;
//       }
//     }
//   }

//   await handlePagination();
//   await browser.close();

//   return NextResponse.json({
//     message: "Data saved to Firestore",
//     crawledData,
//   });
// }
