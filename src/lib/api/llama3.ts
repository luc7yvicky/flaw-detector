import { getPromptConfig } from "@/lib/promptConfig";
import {
  BASE_URL,
  LLAMA_AUTH_URL,
  LLAMA_PASSWORD,
  LLAMA_USERNAME,
} from "../const";

export async function generateLlm(
  config_name: string,
  current_message: string,
) {
  const config = getPromptConfig(config_name);
  const user_message = `${current_message}\n${config.systemPrompt}`;

  const response = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_message,
      temperature: config.temperature,
      top_p: config.top_p,
    }),
  });

  if (!response.ok) {
    throw new Error("API 요청 실패");
  }

  const data = await response.json();
  return data.generated_text;
}

export async function getAPItoken() {
  if (!LLAMA_AUTH_URL || !LLAMA_USERNAME || !LLAMA_PASSWORD) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }

  try {
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `네트워크 오류 또는 인증 처리 중 오류 발생: ${error.message}`,
      );
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
}
