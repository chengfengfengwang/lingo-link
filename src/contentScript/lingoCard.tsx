import browser from "webextension-polyfill";
import { useCallback, useEffect, useRef, useState } from "react";
import { isSelectionInEditElement, isWord, preventBeyondWindow } from "@/utils";
import TriggerIcon from "@/components/TriggerIcon";
import {
  defaultCardWidth,
  defaultCardMinHeight,
  defaultTranslateWidth,
  defaultTranslateMinHeight,
  defaultSetting,
} from "@/utils/const";
import SearchResult from "@/components/SearchResult";
import { ToastContainer } from "@/components/Toast";
import { getSentenceFromSelection } from "@/utils/getSelection";
import { currentSelectionInfo } from "@/utils";
import { settingAtom } from "../store";
import { useTranslation } from "react-i18next";
import CardDragableWrapper from "@/components/CardDragableWrapper";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "@/components/FallbackComponent";
//import { emitter } from "@/utils/mitt";
// import { useConversationContext } from "@/context/conversation";
// import Conversation from "./Conversation";
// import { ConversationProvider } from "@/context/conversation";
import { ExtensionMessage } from "@/types";
import onCaptureScreenResult from "@/utils/onCaptureScreenResult";
import { useAtom } from "jotai";
import useTreeWalker from "@/hooks/useTreeWalker";
import CollectModal from "@/components/CollectModal";
// export default function ConversationProviderWrapper() {
//   return (
//     <ConversationProvider>
//       <ContentScriptApp />
//     </ConversationProvider>
//   );
// }
export default function ContentScriptApp() {
  const mouseoverCollectTimer = useRef<number | null>(null);
  const hideCardTimer = useRef<number | null>(null);
  const [setting] = useAtom(settingAtom);
  const { i18n } = useTranslation();
  // const {
  //   conversationShow,
  //   conversationEngine,
  //   messageList,
  //   setConversationShow,
  // } = useConversationContext();

  const [triggerIconShow, setTriggerIconShow] = useState(false);
  const [triggerIconPosition, setTriggerIconPosition] = useState({
    x: 0,
    y: 0,
  });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [cardShow, setCardShow] = useState(false);
  const rangeRef = useRef<Range | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const showCardAndPosition = useCallback(
    ({
      text,
      position,
      domRect,
    }: {
      text: string;
      domRect?: DOMRect;
      position?: { x: number; y: number };
    }) => {
      setCardShow(true);
      setSearchText(text);
      setTriggerIconShow(false);
      let x = -300;
      let y = -300;
      if (domRect) {
        const position = preventBeyondWindow({
          boxWidth: isWord({
            input: text,
            lang: setting.sourceLanguage?.language,
          })
            ? defaultCardWidth
            : defaultTranslateWidth,
          boxHeight: isWord({
            input: text,
            lang: setting.sourceLanguage?.language,
          })
            ? defaultCardMinHeight
            : defaultTranslateMinHeight,
          domRect,
          gap: 10,
        });
        x = position.x;
        y = position.y;
      }
      if (position) {
        x = position.x;
        y = position.y;
      }
      setCardPosition({ x, y });
    },
    [setting.sourceLanguage?.language]
  );
  const mouseoverCollectCallback = useCallback(
    ({ ele }: { ele: HTMLElement }) => {
     
      if (mouseoverCollectTimer.current) {
        clearTimeout(mouseoverCollectTimer.current);
      }
      mouseoverCollectTimer.current = window.setTimeout(() => {
        showCardAndPosition({
          text: ele.innerText,
          domRect: ele.getBoundingClientRect(),
        });
      }, 300);
    },
    [showCardAndPosition]
  );
  const onmouseenterCard = useCallback(() => {
    hideCardTimer.current && clearTimeout(hideCardTimer.current);
  }, []);  
  useTreeWalker({
    mouseoverCallback: mouseoverCollectCallback
  })
  useEffect(() => {
    const handleMouseUp = async function (event: MouseEvent) {
      if (isSelectionInEditElement()) {
        return;
      }
      const selection = window.getSelection()?.toString().trim();
      if (
        selection &&
        (setting.showSelectionIcon ?? defaultSetting.showSelectionIcon)
      ) {
        setTriggerIconShow(true);
        setTriggerIconPosition({ x: event.pageX, y: event.pageY + 10 });
      }
    };
    const handleMouseDown = function (event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.tagName.toUpperCase() !== "LINGO-LINK") {
        setTriggerIconShow(false);
        setCardShow(false);
      }
    };
    document.body.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.body.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mousedown", handleMouseDown);
    };
  }, [setting.showSelectionIcon]);
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isSelectionInEditElement()) {
        return;
      }
      const selection = window.getSelection()?.toString().trim();
      if (
        selection &&
        window.getSelection()?.containsNode(document.body, true)
      ) {
        currentSelectionInfo.word = selection;
        currentSelectionInfo.context = getSentenceFromSelection(
          window.getSelection()
        );
        rangeRef.current = window.getSelection()?.getRangeAt(0);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  
  const handleTriggerClick = () => {
    showCardAndPosition({
      text: currentSelectionInfo.word,
      domRect: rangeRef.current!.getBoundingClientRect(),
    });
  };
  const hideCard = useCallback(() => {
    setCardShow(false);
  }, []);
  const handleCollectFormUpdate = (param) => {
    console.log(param);
    
  }
  useEffect(() => {
    if (setting.interfaceLanguage !== i18n.language) {
      i18n.changeLanguage(
        setting.interfaceLanguage ?? defaultSetting.interfaceLanguage
      );
    }
  }, [setting.interfaceLanguage, i18n]);
  useEffect(() => {
    const handleMessage = async (message: ExtensionMessage) => {
      if (message.type === "showCardAndPosition") {
        if (!currentSelectionInfo.word || !rangeRef.current) {
          console.warn("don't support input element selection");
          return;
        }
        showCardAndPosition({
          text: currentSelectionInfo.word,
          domRect: rangeRef.current!.getBoundingClientRect(),
        });
      }
      if (message.type === "onScreenDataurl") {
        onCaptureScreenResult(message.payload, (result, domRect) =>
          showCardAndPosition({
            text: result,
            domRect,
          })
        );
      }
      if (message.type === "getCurWindowSelectionInfo") {
        const selection = window.getSelection()?.toString().trim();
        if (
          selection &&
          window.getSelection()?.containsNode(document.body, true)
        ) {
          return {
            word: selection,
            context: getSentenceFromSelection(window.getSelection()),
          };
        } else {
          return null;
        }
      }
    };
    browser.runtime.onMessage.addListener(handleMessage);
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [showCardAndPosition]);

  return (
    <div
      style={{ opacity: 0 }}
      className="bg-inherit !opacity-100"
      id="orange-translator-container"
    >
      <TriggerIcon
        size={setting.triggerIconSize ?? defaultSetting.triggerIconSize}
        url={setting.triggerIcon}
        x={triggerIconPosition.x}
        y={triggerIconPosition.y}
        show={triggerIconShow}
        onClick={handleTriggerClick}
      />
      <ErrorBoundary
        FallbackComponent={(fallbackProps) => (
          <FallbackComponent fallbackProps={fallbackProps} />
        )}
      >
        {/* {conversationEngine && conversationShow ? (
          <Conversation
            className="fixed p-2 bg-base-100 h-[60vh] max-h-[100vh] bottom-[20px] rounded-md shadow-[0_0_16px_rgba(0,0,0,0.2)]"
            onClose={() => setConversationShow(false)}
            preMessageList={messageList}
            engine={conversationEngine}
          />
        ) : null} */}
        {cardShow && (
          <CardDragableWrapper
            x={cardPosition.x}
            y={cardPosition.y}
            onClose={hideCard}
            onmouseenter={onmouseenterCard}
          >
            <SearchResult collectFormUpdate={handleCollectFormUpdate} searchText={searchText} />
          </CardDragableWrapper>
        )}
      </ErrorBoundary>
      <ToastContainer />
    </div>
  );
}
