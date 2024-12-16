import { BASE_URL } from "../const";

export async function getSearchKeywords() {
  const res = await fetch(`${BASE_URL}/api/ranking`);

  if (!res.ok) {
    throw new Error("검색어를 불러오는 데 실패했습니다.");
  }

  const data = await res.json();
  return data.results || [];
}

export async function updateRealTimeTopic(searchTerm: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/ranking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchTerm,
      }),
    });

    if (!response.ok) {
      throw new Error("실시간 topic 업데이트에 실패했습니다.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("실시간 topic 업데이트에 실패했습니다.");
  }
}
