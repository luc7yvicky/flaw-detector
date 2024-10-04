const getLlamaAPItoken = async () => {
  const LLAMA_AUTH_URL = process.env.LLAMA_AUTH_URL;
  const LLAMA_USERNAME = process.env.LLAMA_USERNAME;
  const LLAMA_PASSWORD = process.env.LLAMA_PASSWORD;

  if (!LLAMA_AUTH_URL || !LLAMA_USERNAME || !LLAMA_PASSWORD) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", LLAMA_USERNAME);
    params.append("password", LLAMA_PASSWORD);
    params.append("scope", "");

    const authResponse = await fetch(LLAMA_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!authResponse.ok) {
      throw new Error("토큰 발급 도중 에러가 발생했습니다.");
    }

    const data = await authResponse.json();
    return data.access_token;
  } catch (error) {
    console.error("토큰 발급 도중 에러가 발생했습니다.", error);
  }
};

export default async function generateLlamaText(user_message) {
  const LLAMA_API_URL = process.env.LLAMA_API_URL;
  if (!LLAMA_API_URL) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }

  try {
    const token = await getLlamaAPItoken();

    const response = await fetch(LLAMA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_message,
        temperature: 0.9,
        top_p: 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `텍스트 생성 도중 에러가 발생했습니다. ${response.status}`,
      );
    }

    const result = await response.text();
    return result;
  } catch (error) {
    console.log("텍스트 생성 도중 에러가 발생했습니다.", error);
  }
}
