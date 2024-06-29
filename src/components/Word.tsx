import YoudaoSpeaker from "./Speaker";
import {
  CheckCheck,
  Heart,
  Undo2,
  MessageCircle,
  Pencil,
  Inbox,
  Carrot,
} from "lucide-react";
import { useRef } from "react";
import { CommunityItemType, Sww } from "@/types/words";
import Highlight from "./Highlight";
import useYoudao from "./useYoudao";
import { useTranslation } from "react-i18next";
import RenderWordChat from "./WordChat";
import { defaultSetting } from "@/utils/const";
//import { useConversationContext } from "@/context/conversation";
import WordChat from "./WordChat";
// import useCollins from "./useCollins";
import CardFooter from "./CardFooter";
import { EngineValue } from "@/types";
import ContentMore from "./ContentMore";
import useOldYoudao from "./useOldYoudao";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";
import RenderRemark from "./RenderRemark";
function RenderYoudaoWord({ searchText }: { searchText: string }) {
 const {t} = useTranslation();
  const [setting] = useAtom(settingAtom);
  const sourceLang =
    setting.sourceLanguage?.language ?? defaultSetting.sourceLanguage.language;
  const { loading, wordData } = useYoudao(searchText, sourceLang);

  const wordAutoPlay = setting.autoPronounce ?? defaultSetting.autoPronounce;

  return (
    <>
      {loading  && (
        <div className="flex flex-col gap-2 w-full">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      )}
      {wordData && (
        <>
          <div className="flex flex-wrap">
            {wordData.phonetic.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    index === 0 ? "mr-2" : ""
                  } flex items-center space-x-1`}
                >
                  <span key={index}>
                    {/* {index === 0 ? "英" : "美"} */}
                    {item}
                  </span>
                  <div className="translate-y-[4px]">
                    <YoudaoSpeaker
                      lang={sourceLang}
                      autoPlay={
                        (index === 1 && wordAutoPlay)
                      }
                      text={searchText}
                      type={index + 1 + ""}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <ul className="flex flex-col gap-y-1">
              {wordData.explains.map((item, index) => {
                return (
                  <li key={index}>
                    {item.pos ? <span>{item.pos}</span> : null}
                    <span>{item.trans}</span>
                  </li>
                );
              })}
              {wordData.explains.length === 0 && !loading && (
                <>
                  <div className="text-xs flex items-center  justify-center space-x-1 text-center text-gray-500">
                    <Inbox className="w-[15px] h-[15px]" />
                    <span>{t("The word is not included")}</span>,
                    <span>{t("Check Language Set")}</span>
                  </div>
                </>
              )}
            </ul>
            <div className="mt-1">
              {wordData.examTags?.map((item, index) => (
                <span
                  className={`badge badge-ghost badge-sm  opacity-100`}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
function RenderCollinsWord({ searchText }: { searchText: string }) {
  const [setting] = useAtom(settingAtom);

  const sourceLang =
    setting.sourceLanguage?.language ?? defaultSetting.sourceLanguage.language;
  const { loading, wordData } = useYoudao(searchText, sourceLang);
  const { loading: collinsLoading, wordData: collins } = useOldYoudao(
    searchText,
    sourceLang
  );

  const wordAutoPlay = setting.autoPronounce ?? defaultSetting.autoPronounce;

  return (
    <>
      {(loading || collinsLoading) && (
        <div className="flex flex-col gap-2 w-full">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      )}
      {wordData && (
        <>
          <div className="flex flex-wrap">
            {wordData.phonetic.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    index === 0 ? "mr-2" : ""
                  } flex items-center space-x-1`}
                >
                  <span key={index}>
                    {/* {index === 0 ? "英" : "美"} */}
                    {item}
                  </span>
                  <div className="translate-y-[4px]">
                    <YoudaoSpeaker
                      lang={sourceLang}
                      autoPlay={
                        (index === 1 && wordAutoPlay)
                      }
                      text={searchText}
                      type={index + 1 + ""}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="my-1 -ml-1">
            {wordData.examTags?.map((item, index) => (
              <span
                className={`badge badge-ghost badge-sm opacity-100`}
                key={index}
              >
                {item}
              </span>
            ))}
          </div>
          {!collinsLoading &&
            collins.length === 0 &&
            wordData.explains.map((item, index) => {
              return (
                <div key={index}>
                  {item.pos ? <span>{item.pos}</span> : null}
                  <span>{item.trans}</span>
                </div>
              );
            })}
         
        </>
      )}
      {collins && (
        <div>
          <ContentMore lines={10}>
            {collins.map((item, idx) => (
              <ul key={idx} className="list-decimal list-inside space-y-2">
                {item.explanations.map((subItem, index) => (
                  <li key={index}>
                    <span>{subItem.explanation}</span>
                    <div className="mt-1 opacity-80">
                      {subItem.examples.slice(0, 2).map((_example) => (
                        <div key={_example}>
                          <Highlight
                            key={_example}
                            highlightClassName="font-bold"
                            context={_example ?? ""}
                            wordString={JSON.stringify([searchText])}
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </ContentMore>
        </div>
      )}
    </>
  );
}


const weightArr = [1, 2, 3, 4, 5];
export default function RenderWord({
  searchText,
  collectInfo,
  remarkInfo,
  onHeartClick,
  onMasterClick,
  onPencilClick,
  onWeightChange,
  currentEngine,
  onRefresh,
}: {
  searchText: string;
  collectInfo: Sww | undefined;
  remarkInfo: Partial<CommunityItemType>
  onHeartClick: () => void;
  onMasterClick: () => void;
  onPencilClick: () => void;
  onWeightChange: (num: number) => void;
  currentEngine: EngineValue;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  // const { setConversationEngine, setConversationShow, setMessageList } =
  //   useConversationContext();
  const [setting] = useAtom(settingAtom);
  const wordChatRef = useRef<React.ComponentRef<typeof WordChat>>(null);
  const wordAutoPlay = setting.autoPronounce ?? defaultSetting.autoPronounce;
  const isCollected = Boolean(collectInfo);
  const isMastered =
    collectInfo &&
    (collectInfo.masteryLevel === 1 || collectInfo.masteryLevel === 2);
  const sourceLang =
    setting.sourceLanguage?.language ?? defaultSetting.sourceLanguage.language;
  const wordSystemPrompt =
    setting.wordSystemPrompt ?? defaultSetting.wordSystemPrompt;
  const wordUserContent =
    setting.wordUserContent ?? defaultSetting.wordUserContent;
  const targetLang = setting.targetLanguage ?? defaultSetting.targetLanguage;
  
  const enterConversation = () => {
    // setConversationShow(true);
    // setMessageList(wordChatRef.current?.getMessageList() ?? []);
    // setConversationEngine(currentEngine);
  };
  let result;
  try {
    if (!searchText) {
      result = null;
    } else {
      result = (
        <div className="relative py-1 px-2">
          <div className="flex items-center  mb-1">
            <div className="font-bold text-lg">{searchText}</div>
            {currentEngine !== "youdao" && currentEngine !== "collins" && (
              <YoudaoSpeaker
                className="ml-[7px] mt-[2px]"
                autoPlay={wordAutoPlay}
                text={searchText}
                lang={sourceLang}
                type={"2"}
              />
            )}
            <div className="ml-5 flex items-center space-x-1 mt-[2px]">
              <div
                onClick={onHeartClick}
                data-tip={
                  isCollected
                    ? t("Remove from collection")
                    : t("Add to collection")
                }
                className="bg-base-300 p-[4px] rounded tooltip tooltip-bottom w-[20px] h-[20px] cursor-pointer"
              >
                <Heart
                  className={`w-full h-full stroke-base-content ${
                    isCollected ? "fill-base-content stroke-base-content" : ""
                  } `}
                />
              </div>
              {isCollected && (
                <div
                  onClick={onMasterClick}
                  data-tip={isMastered ? t("Forgot") : t("Mastered")}
                  className="bg-base-300 p-[4px] rounded tooltip tooltip-bottom w-[20px] h-[20px] cursor-pointer"
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
                </div>
              )}
              {(isCollected && !remarkInfo.content && !remarkInfo.imgs?.length) ? (
                <div
                  className="bg-base-300 p-[4px] rounded tooltip tooltip-bottom w-[20px] h-[20px] cursor-pointer"
                  data-tip={t("Take Notes")}
                  onClick={onPencilClick}
                >
                  <MessageCircle className="w-full h-full" />
                </div>
              ) : null}
              {isCollected && (
                <>
                  <div className="hidden dropdown dropdown-bottom">
                    <div
                      tabIndex={0}
                      data-tip={t("Level of importance")}
                      className="tooltip tooltip-bottom bg-base-300 flex items-center justify-center w-[28px] h-[20px] rounded  cursor-pointer"
                    >
                      <Carrot className="w-[12px] h-[12px]" />
                      <span className="text-[13px] ml-[2px]">
                        {collectInfo?.weight ?? 1}
                      </span>
                    </div>
                    <div
                      tabIndex={0}
                      className="dropdown-content rounded-lg shadow-xl bg-base-300 flex items-center p-1 z-[1]"
                    >
                      {weightArr.map((item) => (
                        <li className={`inline-block m-[1px]`} key={item}>
                          <input
                            onChange={() => onWeightChange(item)}
                            type="radio"
                            className="btn btn-xs btn-ghost"
                            checked={item === (collectInfo?.weight ?? 1)}
                            aria-label={item + ""}
                          />
                        </li>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {currentEngine === "collins" && (
            <RenderCollinsWord
              searchText={searchText}
            />
          )}
          {currentEngine === "youdao" && (
            <>
              <RenderYoudaoWord searchText={searchText} />
            </>
          )}
          
          {collectInfo && collectInfo.context && (
            <div className="my-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-bold">
                  {t("Sentence Containing the Word")}
                </span>
                <div
                  data-tip={t("Edit")}
                  onClick={onPencilClick}
                  className="bg-base-300 p-[4px] rounded tooltip tooltip-bottom w-[20px] h-[20px] cursor-pointer"
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
          { (remarkInfo.content || remarkInfo.imgs?.length) ? (
            <div className="my-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-bold">{t("Notes")}</span>
                <div
                  data-tip={t("Edit")}
                  onClick={onPencilClick}
                  className="bg-base-300 p-[4px] rounded tooltip tooltip-bottom w-[20px] h-[20px] cursor-pointer"
                >
                  <Pencil className="w-full h-full" />
                </div>
              </div>
              <RenderRemark content={remarkInfo.content} imgs={remarkInfo.imgs ?? []} />
            </div>
          ) : null}
          <RenderWordChat
            ref={wordChatRef}
            wordSystemPrompt={wordSystemPrompt}
            wordUserContent={wordUserContent}
            targetLang={targetLang}
            currentEngine={currentEngine}
          />
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
    }
  } catch (error) {
    console.log(error);
    
    result = (
      <div className="text-center py-[20px] text-[13px] text-red-600">
        {t("An error occurred")}
      </div>
    );
  }
  return <div>{result}</div>;
}
