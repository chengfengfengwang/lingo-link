import OpenAIClass from "@/api/openAI";
import DeepSeekClass from "@/api/deepSeek";
import GeminiClass from "@/api/gemini";
import WenxinClass from "@/api/wenxin";
import type { EngineValue } from "@/types";
import MoonShotClass from "./moonShot";

export const getChat = (engine:EngineValue) => {
  switch (engine) {
    case 'openai':
      return  OpenAIClass
    case "gemini":          
      return  GeminiClass
    case "wenxin":
      return  WenxinClass
    case "moonshot":
      return  MoonShotClass
    case "deepseek":
      return  DeepSeekClass
  }
}