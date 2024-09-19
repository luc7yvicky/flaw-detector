import { generateLlamaText } from "./llama3";
import { CertCCLocalizedTextBlock, CertCCTextBlock, VulDBPost } from "./type";
import { isCertCCContentType } from "./typeGuards";
import * as logger from "firebase-functions/logger";

export const translateText = async (originalText: string) => {
  try {
    const res = await generateLlamaText(
      `다음 텍스트를 번역해주세요. ${originalText}`,
    );
    return res || "";
  } catch (error) {
    logger.error("번역 중 에러 발생:", error);
    return "";
  }
};

export const translateSection = async (section: CertCCLocalizedTextBlock) => {
  if (!section || !section.original || section.original.length === 0) {
    return section ? { original: [], translated: [] } : null;
  }

  return Promise.all(
    section.original.map(async (item: CertCCTextBlock) => ({
      ...item,
      text: await translateText(item.text),
    })),
  );
};

export const translateContent = async (content: VulDBPost["content"]) => {
  if (!isCertCCContentType(content)) {
    return;
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

export const translatePost = async (posts: VulDBPost[]) => {
  const translatedPosts = await Promise.all(
    posts?.map(async (post: VulDBPost) => {
      const originalTitle = post.title.original;

      const translatedTitle = await translateText(originalTitle);
      const translatedContent = await translateContent(post.content);

      return {
        ...post,

        title: { original: originalTitle, translated: translatedTitle },
        content: translatedContent,
      };
    }),
  );

  return translatedPosts;
};
