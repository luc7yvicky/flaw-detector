export default function extractPostTitleKeywords(title) {
  const processedTitle = title.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, " ");
  const keywords = processedTitle
    .toLowerCase()
    .split(/\s+/)
    .filter((keyword) => keyword !== "");

  return Array.from(new Set(keywords));
}
