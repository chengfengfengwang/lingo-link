import { createRoot } from "react-dom/client";
import "@/assets/styles/tailwind.css";
import { useCallback, useEffect, useState, useRef } from "react";
import debounce from "lodash.debounce";
import { EngineValue, Setting } from "@/types";
import { getSetting } from "@/storage/sync";
import CollectForm from "@/components/CollectForm";
import PopupFooter from "./footer";
import { Sww } from "@/types/words";
import { addSwwApi, updateWordApi } from "@/api";
import { v4 as uuidv4 } from "uuid";
import { addWord, updateWord } from "@/storage/local";
import { ToastContainer } from "@/components/Toast";
import { hasWord } from "@/utils";
import { getLocal } from "@/storage/local";
import { toastManager } from "@/components/Toast";
import PopupInput from "@/components/PopupInput";
import "@/i18n.ts";
import SearchResult from "@/components/SearchResult";
import { useTranslation } from "react-i18next";
import { defaultSetting } from "@/utils/const";

// import {
//   ConversationProvider,
//   useConversationContext,
// } from "@/context/conversation";
// import Conversation from "@/components/Conversation";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "@/components/FallbackComponent";
import { addWordOulu } from "@/api/oulu";
export default function App() {
  const { i18n } = useTranslation();
  // const {
  //   conversationShow,
  //   messageList,
  //   conversationEngine,
  //   setConversationShow,
  // } = useConversationContext();
  const [searchText, setSearchText] = useState("");
  const [initialValue, setInitialValue] = useState<
    Pick<Sww, "word" | "context" | "remark"> | undefined
  >(undefined);
  const receivedId = useRef<string | undefined>(undefined);
  const [user, setUser] = useState<Setting["userInfo"] | null>(null);
  const [collectFormShow, setCollectFormShow] = useState(false);
  // eslint-disable-next-line 
  const debounced = useCallback(
    debounce(
      (v: string) => {
        setSearchText(v);
      },
      500,
      { leading: true, trailing: true }
    ),
    []
  );

  const handleInputSubmit = (text: string) => {
    debounced(text);
  };
  useEffect(() => {
    getSetting().then((res) => {
      if (res.userInfo) {
        setUser(res.userInfo);
      }
      if (res.interfaceLanguage !== i18n.language) {
        i18n.changeLanguage(
          res.interfaceLanguage ?? defaultSetting.interfaceLanguage
        );
      }
    });
  }, [i18n]);

  const handleCollectFormUpdate = ({
    show,
    collectInfo,
  }: {
    show: boolean;
    collectInfo?: Partial<Sww> | undefined;
  }) => {
    setCollectFormShow(show);
    setInitialValue(
      collectInfo
        ? {
            word: collectInfo.word ?? "",
            context: collectInfo.context ?? "",
            remark: collectInfo.remark ?? "",
          }
        : undefined
    );
    receivedId.current = collectInfo?.id;
  };
  const handleCollectSubmit = async (
    formValue: Pick<Sww, "word" | "context" | "remark">
  ) => {
    let item: Sww | null = null;
    if (receivedId.current) {
      item = {
        id: receivedId.current,
        lastEditDate: Date.now(),
        ...formValue,
      };
      updateWordApi(item);
      updateWord(item);
    } else {
      item = {
        id: uuidv4(),
        lastEditDate: Date.now(),
        ...formValue,
      };
      if (
        hasWord({ word: item.word, swwList: (await getLocal()).swwList ?? [] })
      ) {
        toastManager.add({ type: "error", msg: "the word already existed" });
        return;
      }
      addWord(item);
      addSwwApi(item);
      addWordOulu(item.word)
    }
    setCollectFormShow(false);
  };

  return (
    <div id="app-wrapper" className="w-[400px]">
      {/* <div className={`${collectFormShow || conversationShow ? "hidden" : ""}`}> */}
      <div className={`${collectFormShow  ? "hidden" : ""}`}>
        <div className={`p-3`}>
          <PopupInput onSubmit={handleInputSubmit} />
          <div className="relative">
            {searchText && (
              <SearchResult
                collectFormUpdate={handleCollectFormUpdate}
                searchText={searchText}
              />
            )}
          </div>
        </div>
        <PopupFooter user={user} />
      </div>

      {collectFormShow && (
        <div className="p-3">
          <CollectForm
            initialValue={initialValue}
            onSubmit={handleCollectSubmit}
            onCancel={() => setCollectFormShow(false)}
            size="sm"
          />
        </div>
      )}
      <ErrorBoundary
        FallbackComponent={(fallbackProps) => (
          <FallbackComponent fallbackProps={fallbackProps} />
        )}
      >
        {/* {conversationShow && conversationEngine ? (
          <Conversation
            onClose={() => {
              setConversationShow(false);
            }}
            className="relative top-0 h-[400px] z-10"
            engine={conversationEngine}
            preMessageList={messageList}
          />
        ) : null} */}
      </ErrorBoundary>

      <ToastContainer />
    </div>
  );
}
createRoot(document.querySelector("#root")!).render(
  <App />
      // <ConversationProvider>
      //     <App />
      // </ConversationProvider>
);
