import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface TestInput {
  text: string;
  source?: string;
  target?: string;

}

class TranslateTool extends MCPTool<TestInput> {
  name = "translate";

  description = "Translates a given text using LibreTranslate API";
  schema = {
    text: {
      type: z.string().min(1),
      description: "Text to translate",
    },
    source: {
      type: z.string().default("auto"),
      description: "Source language code (e.g. 'ko', 'en')",
    },
    target: {
      type: z.string().default("en"),
      description: "Target language code (e.g. 'en', 'ko')",
    },
  };

  async execute(input: TestInput) {
    console.log("🟡 input:", input);

    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: input.text,
        source: input.source || "auto",
        target: input.target || "en",
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  }
}

export default TranslateTool;