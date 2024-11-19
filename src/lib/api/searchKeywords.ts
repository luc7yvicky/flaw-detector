export type SearchKeyword = {
  keyword: string;
  searchCounts: number;
};

export async function getSearchKeywords() {
  try {
    const res = await fetch("/api/search");
    const data = await res.json();

    if (!res.ok) {
      throw Error("검색어를 불러오는 데 실패했습니다.");
    }

    if (!data.results) {
      return null;
    } else {
      return data.results as SearchKeyword[];
    }
  } catch (error) {
    throw error;
  }
}
