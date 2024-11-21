import { BASE_URL } from "../const";

type SearchKeyword = {
  keyword: string;
  searchCounts: number;
};

export async function getSearchKeywords(): Promise<SearchKeyword[]> {
  const res = await fetch(`${BASE_URL}/api/search`);

  if (!res.ok) {
    throw new Error("검색어를 불러오는 데 실패했습니다.");
  }

  const data = await res.json();
  return data.results || [];
}
