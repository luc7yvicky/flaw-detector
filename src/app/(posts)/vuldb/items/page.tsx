import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { getAllPosts } from "@/lib/api/posts";
import {
  WEB_CRAWLING_CERT_CC_API_URL,
  WEB_CRAWLING_CNNVD_API_URL,
} from "@/lib/const";
import {
  CertCCLocalizedTextBlock,
  CertCCTextBlock,
  CnnvdLocalizedTextBlock,
  VulDBPost,
} from "@/types/post";
import { isCertCCContentType } from "@/types/typeGuards";

// Web Crawling ---------------------------------------------------------------
async function getCertCCWebScrawlingData() {
  const res = await fetch(WEB_CRAWLING_CERT_CC_API_URL, {
    method: "GET",
  });
  if (!res.ok) {
    console.log("res", res);
  }
  const data = await res.json();
  return data;
}

async function getCNNVDWebScrawlingData() {
  const res = await fetch(WEB_CRAWLING_CNNVD_API_URL, {
    method: "GET",
  });
  if (!res.ok) {
    console.log("res", res);
  }
  const data = await res.json();
  return data;
}

// Translation ----------------------------------------------------------------
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
    throw new Error(`생성 실패 (status code: ${res.status})`);
  }

  const data = await res.json();
  return data;
}

export default async function VulDBPage() {
  try {
    const certCCData = await getCertCCWebScrawlingData();
    const CNNVDData = await getCNNVDWebScrawlingData();

    // if (!posts || !certCCData) {
    //   return <div>Error loading data</div>;
    // }

    console.log("certCCData", certCCData);
    console.log("CNNVDData", CNNVDData);

    const translateText = async (originalText: string) => {
      const res = await getGeneratedText(
        `다음 텍스트를 번역해주세요. url은 제외하고 이어서 번역해주세요. ${originalText}`,
      );
      return res.generated_text;
    };

    const translateSection = async (
      section: CertCCLocalizedTextBlock | CnnvdLocalizedTextBlock,
    ) => {
      //CertCCLocalizedTextBlock 처리
      if ("original" in section && Array.isArray(section.original)) {
        if (!section || section.original.length === 0) {
          return section ? { original: [], translated: [] } : null;
        }

        const translatedOriginal = await Promise.all(
          section.original.map(async (item: CertCCTextBlock) => ({
            ...item,
            text: await translateText(item.text),
          })),
        );

        return {
          original: section.original,
          translated: translatedOriginal,
        };
      }

      //CnnvdLocalizedTextBlock 처리
      if ("text" in section && typeof section.text === "string") {
        if (!section || section.text.length === 0) {
          return { original: "", translated: "" };
        }

        const translatedText = await translateText(section.text);

        return {
          original: section.text,
          translated: translatedText,
        };
      }
      return null; //처리불가인 경우
    };

    const translateContent = async (content: VulDBPost["content"]) => {
      if (!isCertCCContentType(content)) {
        return {
          description: {
            original: content.description.original,
            translated: await translateSection(content.description),
          },
          introduction: {
            original: content.introduction.original,
            translated: await translateSection(content.introduction),
          },
          vulnDetail: {
            original: content.vulnDetail.original,
            translated: await translateSection(content.vulnDetail),
          },
          remediation: {
            original: content.remediation.original,
            translated: await translateSection(content.remediation),
          },
        };
      }

      return {
        overview: {
          original: content.overview.original,
          translated: await translateSection(content.overview),
        },
        description: {
          original: content.description.original,
          translated: await translateSection(content.description),
        },
        impact: {
          original: content.impact.original,
          translated: await translateSection(content.impact),
        },
        solution: {
          original: content.solution.original,
          translated: await translateSection(content.solution),
        },
        cveIDs: content.cveIDs,
      };
    };

    const translatedPosts = await Promise.all(
      certCCData.posts.map(async (post: VulDBPost) => {
        const originalTitle = post.title.original;

        const translatedTitle = await translateText(originalTitle);
        const translatedContent = await translateContent(post.content);

        console.log("Translated CNNVD Content:", translatedContent); //@@@

        return {
          ...post,
          title: { original: originalTitle, translated: translatedTitle },
          content: translatedContent,
        };
      }),
    );

    console.log(translatedPosts);
    console.log("번역된 내용:", translateContent);

    if (translatedPosts) {
      translatedPosts.map(async (post: VulDBPost) => {
        // return await addVulDBPost(post); @@@
      });
    }

    const posts = (await getAllPosts()) || [];

    if (posts.length === 0) {
      return (
        <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
          현재 이용 가능한 게시글이 없습니다.
        </p>
      );
    }

    return (
      <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
        <VulDBImageCardContainer posts={posts} />
        <VulDBDashboard posts={posts} /> {/* 취약점 DB & 실시간 Topic */}
      </div>
    );
  } catch (error) {
    return (
      <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
        게시물을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </p>
    );
  }
}
