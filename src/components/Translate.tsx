import { useEffect, useState, useRef } from "react";
import { CheckCheck, Heart, Undo2, MessageCircle, Pencil } from "lucide-react";
import Highlight from "./Highlight";
import type { Sww } from "@/types/words";
import InputBlink from "./InputBlink";
import { Message } from "@/types/chat";
import { useErrorBoundary } from "react-error-boundary";
import { defaultSetting } from "@/utils/const";
import { useTranslation } from "react-i18next";
//import { useConversationContext } from "@/context/conversation";
import YoudaoSpeaker from "./Speaker";
import translate from "@/utils/translate";
import { EngineValue } from "@/types";
import CardFooter from "./CardFooter";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";

export default function Translate({
  searchText,
  collectInfo,
  onHeartClick,
  onMasterClick,
  onPencilClick,
  currentEngine,
  onRefresh,
}: {
  searchText: string;
  collectInfo: Sww | undefined;
  onHeartClick: () => void;
  onMasterClick: () => void;
  onPencilClick: () => void;
  currentEngine: EngineValue;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  // const { setConversationShow, setMessageList, setConversationEngine } =
  //   useConversationContext();
  const [setting] = useAtom(settingAtom);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [translateResult, setTranslateResult] = useState("");
  const messageListRef = useRef<Message[]>([]);
  const { showBoundary } = useErrorBoundary();

  const hasRemarkContent =
    collectInfo?.remark &&
    collectInfo.remark !== '""' &&
    collectInfo.remark !== '{"ops":[{"insert":"\\n"}]}';
  const isMastered =
    collectInfo &&
    (collectInfo.masteryLevel === 1 || collectInfo.masteryLevel === 2);
  const sourceLang =
    setting.sourceLanguage?.language ?? defaultSetting.sourceLanguage.language;
  const targetLang = setting.targetLanguage ?? defaultSetting.targetLanguage;

  const enterConversation = () => {
    // setConversationShow(true);
    // setMessageList(messageListRef.current);
    // setConversationEngine(currentEngine);
  };
  useEffect(() => {
    let ignore = false;
    translate({
      originText: searchText,
      engine: currentEngine,
      beforeRequest() {
        setLoading(true);
      },
      onError(msg) {
        setLoading(false);
        setGenerating(false);
        showBoundary(msg);
      },
      onGenerating(result) {
        if (ignore) {
          return;
        }
        setLoading(false);
        setGenerating(true);
        setTranslateResult(result);
      },
      onSuccess(result, messageList) {
        if (ignore) {
          return;
        }
        setLoading(false);
        setGenerating(false);
        setTranslateResult(result);
        if (messageList) {
          messageListRef.current = messageList;
        }
      },
    });
    return () => {
      ignore = true;
    };
  }, [searchText, currentEngine, showBoundary]);
  let result;
  if (loading) {
    return (
      <div className="flex flex-col gap-2 w-full p-2">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  }
  try {
    result = (
      <div className="relative space-y-2 text-[15px] px-2 pb-3 pt-3">
        <div>
          <span>{translateResult}</span>

          {generating && <InputBlink />}
          <span className="align-bottom inline-flex items-center ml-[6px] gap-1">
            <span className=" space-x-1 relative top-[3px]">
              <span
                onClick={onHeartClick}
                data-tip={
                  collectInfo
                    ? t("Remove from collection")
                    : t("Add to collection")
                }
                className="p-[1px] rounded tooltip tooltip-bottom w-[16px] h-[16px] cursor-pointer"
              >
                <Heart
                  className={`w-full h-full stroke-base-content ${
                    collectInfo ? "fill-base-content stroke-base-content" : ""
                  } `}
                />
              </span>

              {collectInfo && (
                <span
                  onClick={onMasterClick}
                  data-tip={isMastered ? t("Forgot") : t("Mastered")}
                  className="p-[4px] rounded tooltip tooltip-bottom w-[21px] h-[21px] cursor-pointer"
                >
                  {isMastered ? (
                    <Undo2
                      className={`w-full h-full stroke-base-content stroke-2`}
                    />
                  ) : (
                    <CheckCheck
                      className={`w-full h-full stroke-base-content`}
                    />
                  )}
                </span>
              )}
              {collectInfo && !hasRemarkContent && (
                <span
                  className="hidden p-[4px] rounded tooltip tooltip-bottom w-[21px] h-[21px] cursor-pointer"
                  data-tip={t("Take Notes")}
                  onClick={onPencilClick}
                >
                  <MessageCircle className="w-full h-full" />
                </span>
              )}
            </span>
            <YoudaoSpeaker
              className="mt-[1px]"
              lang={sourceLang}
              autoPlay={false}
              text={searchText}
              type={"2"}
            />
          </span>
        </div>

        {hasRemarkContent && (
          <div className="my-2">
            <div
              className="flex items-center space-x-2 mb-1"
              onClick={onPencilClick}
            >
              <span className="text-lg font-bold">{t("Notes")}</span>
              <div
                data-tip={t("Edit")}
                className="p-[4px] rounded tooltip tooltip-bottom w-[21px] h-[21px] cursor-pointer"
              >
                <Pencil className="w-full h-full" />
              </div>
            </div>
          </div>
        )}
        {collectInfo && collectInfo.context && (
          <div className="my-2">
            <div
              className="flex items-center space-x-2 mb-1"
              onClick={onPencilClick}
            >
              <span className="text-lg font-bold">
                {t("Sentence Containing the Word")}
              </span>
              <div
                data-tip={t("Edit")}
                className="p-[4px] rounded tooltip tooltip-bottom w-[21px] h-[21px] cursor-pointer"
              >
                <Pencil className="w-full h-full" />
              </div>
            </div>
            <div>
              <Highlight
                highlightClassName="font-bold"
                context={collectInfo.context}
                wordString={JSON.stringify([searchText])}
              />
            </div>
          </div>
        )}
        <CardFooter
          currentEngine={currentEngine}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onRefresh={onRefresh}
          enEnterConversationClick={enterConversation}
          searchText={searchText}
        />
      </div>
    );
  } catch (error) {
    result = (
      <div className="text-center py-[20px] text-[13px] text-red-600">
        {t("An error occurred")}
      </div>
    );
  }
  return (
    <>
      <div>{result}</div>
    </>
  );
}
