import { RotateCcw, MessagesSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import ExternalLink from "./ExternalLink";
import { isInPopup } from "@/utils";
export default function CardFooter({
  currentEngine,
  targetLang,
  onRefresh,
  enEnterConversationClick,
  sourceLang,
  searchText,
}: {
  targetLang: string;
  currentEngine: string;
  sourceLang: string;
  onRefresh: () => void;
  enEnterConversationClick: () => void;
  searchText: string;
}) {
  const { t } = useTranslation();
  const ExternalCom = (
    <div className="flex items-center space-x-1 text-xs text-gray-400">
      <span>{t("External Links")}:</span>
      <ExternalLink searchText={searchText} />
    </div>
  );
  return (
    <>
      <div className="flex items-center  text-xs text-gray-400 mt-2 space-x-4">
        <div className="flex items-center">
          <span>translated by {currentEngine}</span>
          {currentEngine === "youdao" && (
            <span className="ml-1 text-gray-500">
              {" "}
              {sourceLang} to {targetLang}
            </span>
          )}
          <span
            onClick={onRefresh}
            data-tip={t("Refresh")}
            className="ml-2 text-gray-500 mt-[2px] p-[1px] rounded tooltip tooltip-top  cursor-pointer"
          >
            <RotateCcw className={`w-[14px] h-[14px] fill-none`} />
          </span>
          {currentEngine !== "google" && currentEngine !== "youdao" && (
            <span
              onClick={enEnterConversationClick}
              data-tip={t("Enter The Conversation")}
              className="ml-2 text-gray-500 mt-[2px] p-[1px] rounded tooltip tooltip-top  cursor-pointer"
            >
              <MessagesSquare className={`w-[14px] h-[14px] fill-none`} />
            </span>
          )}
        </div>
        {!isInPopup && ExternalCom}
      </div>
      {isInPopup && <div className="mt-1">{
        ExternalCom
      }
      </div>}
    </>
  );
}
