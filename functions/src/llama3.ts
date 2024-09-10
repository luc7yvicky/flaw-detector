import axios from "axios";
import * as logger from "firebase-functions/logger";

export const getLlamaAPItoken = async () => {
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

    const authResponse = await axios.post(LLAMA_AUTH_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return authResponse.data.access_token;
  } catch (error) {
    logger.error("토큰 발급 도중 에러가 발생했습니다.", error);
  }
};

export const generateLlamaText = async (user_message: string) => {
  const LLAMA_API_URL = process.env.LLAMA_API_URL;
  if (!LLAMA_API_URL) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }

  try {
    const token = await getLlamaAPItoken();
    logger.info(`토큰 발급에 성공했습니다: ${token}`);

    const response = await axios.post(
      LLAMA_API_URL,
      {
        user_message,
        temperature: 0.9,
        top_p: 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    logger.error("텍스트 생성 도중 에러가 발생했습니다.", error);
  }
};
