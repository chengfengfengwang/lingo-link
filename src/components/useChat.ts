import { useEffect, useState, useRef } from "react";
import { Message } from "@/types/chat";
import { useErrorBoundary } from "react-error-boundary";
import type { Chat } from "@/types/chat";
import { EngineValue } from "@/types";
import { ChatConstructor } from "@/api/openAI";
import { getChat } from "@/api/chat";
export default function useChat({
  preMessageList,
  parentMessageId,
  conversationId,
  engine,
}: {
  preMessageList?: Message[];
  parentMessageId?: string;
  conversationId?: string;
  engine: EngineValue;
}) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>(
    preMessageList ?? []
  );
  const [translateResult, setTranslateResult] = useState("");
  const chatInstance = useRef<Chat | null>(null);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    // if (chatInstance.current) {
    //   return;
    // }
    preMessageList && setMessageList(preMessageList);
    const chatOptions: ChatConstructor = {
      preMessageList: preMessageList ?? [],
      onBeforeRequest() {
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
        chatInstance.current &&
          setMessageList(chatInstance.current.messageList);
      },
      onError(err) {
        setGenerating(false);
        setLoading(false);
        showBoundary(err);
      },
    };
    const chatClass = getChat(engine);
    if (!chatClass) {
      return;
    }
    chatInstance.current = new chatClass(chatOptions);
  }, [preMessageList, conversationId, parentMessageId, engine]);
  return {
    loading,
    generating,
    chatInstance,
    translateResult,
    messageList,
  };
}
