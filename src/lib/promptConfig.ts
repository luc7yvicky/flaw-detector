export interface PromptConfig {
  systemPrompt: string;
  temperature: number;
  top_p: number;
}

export const promptConfigs: Record<string, PromptConfig> = {
  analyze: {
    systemPrompt: `
   Analyze the provided code to identify elements that could impact security vulnerabilities, and suggest improvements along with code snippets.
Answer with Korean language.
    `,
    temperature: 0.1,
    top_p: 0.9,
  },
  translate: {
    systemPrompt:
      "Please translate security vulnerability documents written in English or Chinese into Korean.",
    temperature: 0.9,
    top_p: 1.0,
  },
  chatbot: {
    systemPrompt: "You are an assistant for a reader about code vulnerability.",
    temperature: 0.9,
    top_p: 1.0,
  },
};

export function getPromptConfig(configName: string): PromptConfig {
  return promptConfigs[configName] || promptConfigs.default;
}
