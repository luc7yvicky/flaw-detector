import generateLlamaText from "./llama3.mjs";

const translateText = async (originalText) => {
  try {
    const res = await generateLlamaText(
      `Please translate the following text into Korean: ${originalText}. Provide only the translated text without any additional explanation.`,
    );
    return res || "";
  } catch (error) {
    console.error("번역 중 에러 발생:", error);
    return "";
  }
};

const translateSection = async (section) => {
  if (!section || !section.original || section.original.length === 0) {
    return section ? { original: [], translated: [] } : null;
  }

  return Promise.all(
    section.original.map(async (item) => ({
      ...item,
      text: await translateText(item.text),
    })),
  );
};

const translateContent = async (content) => {
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

export default async function translatePost(posts) {
  const translatedPosts = await Promise.all(
    posts?.map(async (post) => {
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
}
