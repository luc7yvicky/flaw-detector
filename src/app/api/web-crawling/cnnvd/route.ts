import { getChromeExecutablePath } from "@/lib/api/chrome";
import { handleError } from "@/lib/helpers";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import db from "../../../../../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

export async function GET() {
  try {
    const executablePath = getChromeExecutablePath();

    // Puppeteer로 브라우저 실행
    const browser = await puppeteer.launch({
      executablePath,
      headless: false,
    });

    console.log("Browser launched successfully");

    const page = await browser.newPage();
    console.log("New page created");

    // 크롤링할 사이트 URL로 이동
    const url = "https://www.cnnvd.org.cn/home/warn";
    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: "networkidle0" });
    console.log("Page navigation completed");

    // 크롤링 코드 작성
    await page.waitForSelector("p.content-title", {
      timeout: 10000,
    });

    const elements = await page.$$("p.content-title");
    if (elements.length > 0) {
      console.log(`Found ${elements.length} elements`);

      //클릭 후 들어가서 데이터를 크롤링할 배열 준비
      const crawledData = [];

      for (const [index, element] of Array.from(elements.entries())) {
        console.log(`Attempting to click on element ${index + 1}`);

        // 다시 요소를 선택
        const refreshedElements = await page.$$("p.content-title");
        const refreshedElement = refreshedElements[index];

        // 요소가 존재하는지 확인
        if (!refreshedElement) {
          console.log(
            `Element at index ${index + 1} not found after navigation.`,
          );
          continue; // 다음 요소로 넘어감
        }

        // 클릭 이벤트 발생
        await refreshedElement.click();
        console.log("Element clicked, waiting for selector");

        // 특정 요소 로드를 기다림
        await page.waitForSelector("p.detail-title", {
          visible: true,
          timeout: 60000,
        });
        console.log("Detail content loaded");

        //상세 페이지의 데이터 크롤링
        const detailTitle = await page.$eval("p.detail-title", (el) =>
          el.textContent?.trim(),
        );
        const paragraphs = await page.$$eval(
          "div.detail-content > p",
          (elements) =>
            elements
              .map((el) => el.textContent?.trim())
              .filter((text) => text !== ""),
        );

        const tableData = await page.$$eval(
          "div.detail-content table",
          (tables) =>
            tables.flatMap((table) => {
              const rows = Array.from(table.querySelectorAll("tr"));

              // 첫 번째 행을 컬럼 헤더로 사용
              const headers = Array.from(
                rows[0].querySelectorAll("th, td"),
              ).map((header) => header.textContent?.trim());

              // 나머지 행을 데이터로 사용
              return rows.slice(1).map((row) => {
                const columns = Array.from(row.querySelectorAll("td"));
                return columns.reduce(
                  (acc: { [key: string]: string }, column, index) => {
                    acc[headers[index] || `Column${index + 1}`] =
                      column.textContent?.trim() || "";
                    return acc;
                  },
                  {},
                );
              });
            }),
        );

        if (detailTitle && paragraphs.length > 0) {
          console.log("Detail Page Data:", {
            detailTitle,
            paragraphs,
            tableData,
          });

          //크롤링한 데이터 저장
          crawledData.push({
            detailTitle,
            paragraphs,
            tableData,
            timestamp: new Date(),
          });
        } else {
          console.log("Failed to retrieve data from detail page");
        }
        //다시 원래 페이지 돌아가기
        await page.goBack({ waitUntil: "networkidle0" });
        console.log(
          `Returned to main page after processing element ${index + 1}`,
        );
      }

      if (crawledData.length > 0) {
        //firestore에 각 크롤링 데이터 개별 문서로 저장
        const collectionRef = collection(db, "cnnvd-data");

        for (const data of crawledData) {
          const newDocRef = doc(collectionRef);
          await setDoc(newDocRef, data);
        }

        console.log("All data written to Firestore successfully");
      } else {
        console.log("No data was crawled.");
      }

      // 브라우저 종료
      await browser.close();
      console.log("Browser closed successfully");

      // return NextResponse.json({ titles });
      return NextResponse.json({
        message: "DATA saved to Firestore",
        crawledData,
      });
    } else {
      console.log("No elements found with the selector 'p.content-title'");
      throw new Error("Element not found");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return handleError(error);
  }
}
