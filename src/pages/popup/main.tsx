import { createRoot } from "react-dom/client";
import "@/assets/styles/tailwind.css";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Setting } from "@/types";
import { getSetting } from "@/storage/sync";
import PopupFooter from "./footer";
import { ToastContainer } from "@/components/Toast";
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
export default function App() {
  const { i18n } = useTranslation();
  // const {
  //   conversationShow,
  //   messageList,
  //   conversationEngine,
  //   setConversationShow,
  // } = useConversationContext();
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<Setting["userInfo"] | null>(null);
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

  return (
    <div id="app-wrapper" className="w-[400px]">
      {/* <div className={`${collectFormShow || conversationShow ? "hidden" : ""}`}> */}
      <div>
        <div className={`p-3`}>
          <PopupInput onSubmit={handleInputSubmit} />
          <div className="relative">
            {searchText && <SearchResult searchText={searchText} />}
          </div>
        </div>
        <PopupFooter user={user} />
      </div>

      <div id="collect-wrapper"></div>

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
