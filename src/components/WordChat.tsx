import React, { useEffect, useState, useRef } from "react";
import InputBlink from "./InputBlink";
import { currentSelectionInfo } from "@/utils";
import { EngineValue } from "@/types";
import { getChat } from "@/api/chat";
import type { Chat, Message } from "@/types/chat";
import type { ChatConstructor } from "@/api/openAI";
import { useErrorBoundary } from "react-error-boundary";
import { forwardRef, useImperativeHandle } from "react";
interface WordChatParams {
  currentEngine: EngineValue;
  targetLang: string;
  speaker?: React.ReactNode;
  wordSystemPrompt:string,
  wordUserContent:string,
}
const getPreMessages = ({
  wordSystemPrompt,
  wordUserContent,
  targetLang,
}: {
  wordSystemPrompt: string;
  wordUserContent: string;
  engine: EngineValue;
  targetLang: string;
}): Message[] => {
  const rolePrompt = wordSystemPrompt.replace(/\{targetLanguage\}/g, ()=> targetLang).replace(/\{word\}/g, ()=> currentSelectionInfo.word).replace(/\{sentence\}/g, ()=> currentSelectionInfo.context);
  const contentPrompt = wordUserContent.replace(/\{targetLanguage\}/g, ()=> targetLang).replace(/\{word\}/g, ()=> currentSelectionInfo.word).replace(/\{sentence\}/g, ()=> currentSelectionInfo.context);
  
  return [
    {
      role: "system",
      content: rolePrompt,
    },
    {
      role: "assistant",
      content: 'OK.',
    },
    {
      role: "user",
      content: contentPrompt,
    },
  ];
};
export default forwardRef<{getMessageList:()=>Message[]}, WordChatParams>(
   function RenderWordChat(props,ref) {
    const {
      currentEngine,
      speaker,
      targetLang,
      wordSystemPrompt,
      wordUserContent,
    } = props;
    const { showBoundary } = useErrorBoundary();
    const [lines, setLines] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [translateResult, setTranslateResult] = useState("");
    const chatInstance = useRef<Chat | null>(null);
    useImperativeHandle(ref, () => ({
      getMessageList: ()=> chatInstance.current?.messageList ?? [],
    }));
    useEffect(() => {
      setLines(translateResult.split("\n"));
    }, [translateResult]);
    useEffect(() => {
      const preMessages = getPreMessages({
        engine: currentEngine,
        targetLang,
        wordSystemPrompt,
        wordUserContent,
      });
      const chatClass = getChat(currentEngine);
      if (!chatClass) {
        return;
      }
      if (chatInstance.current instanceof chatClass) {
        return;
      }
  
      const chatOptions: ChatConstructor = {
        preMessageList: preMessages,
        onBeforeRequest: () => {
          setLoading(true);
        },
        onComplete: () => {
          setGenerating(false);
          setLoading(false);
        },
        onGenerating(result) {
          setGenerating(true);
          setLoading(false);
          setTranslateResult(result);
        },
        onError(err) {
          setGenerating(false);
          setLoading(false);
          showBoundary(err);
        },
      };
  
      chatInstance.current = new chatClass(chatOptions);
      chatInstance.current.sendMessage();
    }, [currentEngine,showBoundary,wordSystemPrompt,wordUserContent,targetLang]);
    // const refresh = () => {
    //   console.log(chatInstance.current?.messageList);
    // }
    if (loading) {
      return (
        <div className="flex flex-col gap-2 w-full">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      );
    }
    return (
      <div>
        {speaker}
        {lines.map((line, index) => (
          <p className="flex items-center" key={index}>
            {line}
            {generating && index === lines.length - 1 && <InputBlink />}
          </p>
        ))}
      </div>
    );
  }
)

