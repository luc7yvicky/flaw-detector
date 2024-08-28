import { LLAMA_AUTH_URL, LLAMA_PASSWORD, LLAMA_USERNAME } from "@/lib/const";

export async function getAPItoken() {
  if (!LLAMA_USERNAME || !LLAMA_PASSWORD) {
    throw new Error("환경 변수 USERNAME 또는 PASSWORD가 설정되지 않았습니다.");
  }

  const authResponse = await fetch(LLAMA_AUTH_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: LLAMA_USERNAME,
      password: LLAMA_PASSWORD,
      scope: "",
    }),
  });

  if (!authResponse.ok) {
    const errorData = await authResponse.json();
    throw new Error(`인증 실패: ${JSON.stringify(errorData)}`);
  }

  const authData = await authResponse.json();
  return authData.access_token;
}
