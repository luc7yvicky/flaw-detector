import axios from "axios";
import * as logger from "firebase-functions/logger";

export const getLlamaAPItoken = async (
  LLAMA_AUTH_URL: string,
  LLAMA_USERNAME: string,
  LLAMA_PASSWORD: string,
) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", LLAMA_USERNAME);
    params.append("password", LLAMA_PASSWORD);
    params.append("scope", "");

    logger.info("토큰 발급 시작합니다.");
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
