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

      for (const [index] of Array.from(elements.entries())) {
        console.log(`Attempting to click on element ${index + 1}`);

        // 다시 요소를 선택
        const refreshedElements = await page.$$("p.content-title");
        const refreshedElement = refreshedElements[index];

        // 요소가 존재하는지 확인
        if (!refreshedElement) {
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

        // CnnvdContent 추출
        const content = await page.evaluate(() => {
          //모든 p태그 선택
          const paragraphs = document.querySelectorAll(
            "div.detail-content > p.MsoNormal",
          );
          let overview = "";
          let introduction = "";
          let vulnDetail = "";
          let remediation = "";

          let section = "overview";
          let skipNextP = false; //table 이후 나오는 p태그 스킵하기 위한 플래그

          paragraphs.forEach((p) => {
            const text = p.textContent?.trim() || "";

            // <table class="MsoTableGrid">가 등장하면 그 이후의 <p> 태그 스킵
            if (p.tagName === "TABLE" && p.classList.contains("MsoTableGrid")) {
              skipNextP = true;
              return;
            }

            if (skipNextP && p.className === "") {
              // 테이블 바로 다음에 있는 클래스가 없는 <p> 태그는 무시
              return;
            } else if (p.className !== "") {
              skipNextP = false; // 다시 <p class="MsoNormal">이므로 처리할 수 있도록 설정
            }

            if (text.startsWith("一、")) {
              section = "introduction";
              introduction += text + "\n";
              return;
            } else if (text.startsWith("二、")) {
              section = "vulnDetail";
              vulnDetail += text + "\n"; // "二、"이 글자 포함
              return;
            } else if (text.startsWith("三、")) {
              section = "remediation";
              remediation += text + "\n"; // "三、"이 글자 포함
              return;
            }
            if (section === "overview") {
              overview += text + "\n";
            } else if (section === "introduction") {
              introduction += text + "\n";
            } else if (section === "vulnDetail") {
              vulnDetail += text + "\n";
            } else if (section === "remediation") {
              remediation += text + "\n";
            }
          });

          return {
            overview: overview.trim(),
            introduction: introduction.trim(),
            vulnDetail: vulnDetail.trim(),
            remediation: remediation.trim(),
          };
        });

        const timestamp = new Date();
        const created_at = {
          seconds: Math.floor(timestamp.getTime() / 1000),
          nanoseconds: timestamp.getMilliseconds() * 1e6,
        };

        const docData = {
          id: page.url(),
          label: "취약성 경고", // 예시로 "취약성 경고" 사용
          source: "CNNVD",
          page_url: page.url(),
          title: {
            original: detailTitle || "",
            translated: "", // 번역된 제목은 여기서 처리하거나 이후에 추가 가능
          },
          created_at,
          content,
        };

        crawledData.push(docData);

        // Firestore에 저장
        const collectionRef = collection(db, "cnnvd-data");
        const newDocRef = doc(collectionRef);
        await setDoc(newDocRef, docData);

        await page.goBack({ waitUntil: "networkidle0" });
      }

      await browser.close();
      return NextResponse.json({
        message: "Data saved to Firestore",
        crawledData,
      });
    } else {
      throw new Error("Element not found");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return handleError(error);
  }
}
