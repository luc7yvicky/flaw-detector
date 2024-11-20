import { BASE_URL } from "../const";

type SearchKeyword = {
  keyword: string;
  searchCounts: number;
};

export async function getSearchKeywords(): Promise<SearchKeyword[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/search`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error("검색어를 불러오는 데 실패했습니다.");
    }

    return data.results || null;
  } catch (error) {
    console.error("검색어를 불러오는 데 실패했습니다.", error);
    throw error;
  }
}
