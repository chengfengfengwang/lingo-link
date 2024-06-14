import googleTranslate from "@/api/google";
import deepLXTranslate from "@/api/deeplx";
import { getSetting } from "@/storage/sync";
import { defaultSetting } from "./const";
import { formateText } from ".";
import { EngineValue } from "@/types";
import youdaoTranslate from "@/api/youdaoTranslate";
import { getChat } from "@/api/chat";
import type { ChatConstructor } from "@/api/openAI";
import type { Message } from "@/types/chat";
import type { Chat } from "@/types/chat";

const getPreMessages = ({
  text,
  targetLang,
  sentenceSystemPrompt,
  sentenceUserContent,
}: {
  text: string;
  sentenceSystemPrompt: string;
  sentenceUserContent: string;
  targetLang: string;
  engine: EngineValue;
}): Message[] => {
  const rolePrompt = sentenceSystemPrompt
    .replace(/\{targetLanguage\}/g, () => targetLang)
    .replace(/\{sentence\}/g, () => text);
  const contentPrompt = sentenceUserContent
    .replace(/\{targetLanguage\}/g, () => targetLang)
    .replace(/\{sentence\}/g, () => text);

  return [
    {
      role: "system",
      content: rolePrompt,
    },
    {
      role: "assistant",
      content: "OK.",
    },
    {
      role: "user",
      content: contentPrompt,
    },
  ];
};
export default async function ({
  beforeRequest,
  onGenerating,
  onSuccess,
  onError,
  originText,
  engine,
}: {
  beforeRequest: () => void;
  onGenerating?: (result: string) => void;
  onSuccess: (result: string, messageList?: Message[]) => void;
  onError: (msg: string) => void;
  originText: string;
  engine: EngineValue;
}) {  
  const text = formateText(originText);
  const setting = await getSetting();
  const sourceLang =
    setting.sourceLanguage?.language ?? defaultSetting.sourceLanguage.language;
  const targetLang = setting.targetLanguage ?? defaultSetting.targetLanguage;
  beforeRequest();

  try {
    switch (engine) {
      case "deeplx":
        {
          const result = await deepLXTranslate({
            text,
          });
          onSuccess(result!);
        }
        break;
      case "google":
        {
          const googleResult = await googleTranslate({
            text,
            targetLang,
          });
          onSuccess(googleResult);
        }
        break;
      case "youdao":
        {
          const youdaoResult = await youdaoTranslate({
            text,
            source: sourceLang,
            target: targetLang,
          });
          onSuccess(youdaoResult);
        }
        break;
      default:
        {
          const chatClass = getChat(engine);
          if (!chatClass) {
            throw "engine doesn't exist";
          }
          const sentenceSystemPrompt =
            setting.sentenceSystemPrompt ?? defaultSetting.sentenceSystemPrompt;
          const sentenceUserContent =
            setting.sentenceUserContent ?? defaultSetting.sentenceUserContent;
          let chatInstance: Chat | null = null;

          const chatOptions: ChatConstructor = {
            preMessageList: getPreMessages({
              text,
              engine,
              targetLang,
              sentenceSystemPrompt,
              sentenceUserContent,
            }),
            onComplete(result) {
              onSuccess(result, chatInstance?.messageList);
            },
            onGenerating,
            onError,
          };
          chatInstance = new chatClass(chatOptions);
          chatInstance.sendMessage();
        }
        break;
    }
  } catch (error) {
    onError(error as string);
  }
}
