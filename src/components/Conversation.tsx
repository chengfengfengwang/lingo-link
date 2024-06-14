import ChatInput from "@/components/ChatInput";
import type { Message } from "@/types/chat";
import InputBlink from "./InputBlink";
import useChat from "./useChat";
import GeminiClass from "@/api/gemini";
import { EngineValue } from "@/types";
export default function Conversation ({
  preMessageList,
  parentMessageId,
  conversationId,
  className,
  onClose,
  engine
}: {
  preMessageList: Message[];
  className?: string;
  parentMessageId?: string | undefined;
  conversationId?: string | undefined;
  onClose?:()=>void;
  engine:EngineValue
}) {
  const { messageList, loading, chatInstance } = useChat({
    preMessageList,
    parentMessageId,
    conversationId,
    engine
  });
  const handleRequest = (content: string) => {
    chatInstance.current?.sendMessage(content);
    // const messageWrapperDom = messagesWrapper.current
    // setTimeout(() => {
    //   if (
    //     messageWrapperDom.scrollHeight -
    //       messageWrapperDom.scrollTop -
    //       messageWrapperDom.clientHeight >
    //     50
    //   ) {
    //     messagesWrapper.current.scrollTop = messagesWrapper.current.scrollHeight
    //   }
    // }, 100)
  };  

  const renderMessageList = messageList.filter(
    (_item,index) => chatInstance.current instanceof GeminiClass ? (index !== 0 && index !==1 ) : index !== 0
  );
  return (
    <div
      className={`overflow-auto pt-3 right-0 w-[400px] flex flex-col ${className}`}
    >
      <button onClick={onClose} className="absolute left-2 top-2 btn btn-circle btn-xs z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="grow overflow-hidden">
        <div
          className={`cat_message_wrapper space-y-3 px-2 py-2 h-full overflow-y-scroll`}
        >
          {renderMessageList.map((item, index) => {
            return (
              <div
                className={`flex ${
                  item.role === "user" ? "justify-end" : "justify-start"
                }`}
                key={index}
              >
                {/* <RenderOpenAiResult
                  loading={loading && index === renderMessageList.length - 1}
                  result={item.content}
                  role={item.role}
                  isError={item.isError}
                ></RenderOpenAiResult> */}
                <div
                  className={`${
                    item.role === "user"
                      ? "bg-neutral text-neutral-content rounded-br-md"
                      : "bg-neutral text-neutral-content rounded-tl-md"
                  } ${
                    item.isError ? "text-error-content" : ""
                  } group rounded-3xl  px-4 py-3 relative shadow break-words min-w-0`}
                >
                  {item.content}
                  {loading && index === renderMessageList.length - 1 && (
                    <InputBlink />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="shrink-0">
        <ChatInput onSubmit={handleRequest} placeholder=""></ChatInput>
      </div>
    </div>
  );
}
