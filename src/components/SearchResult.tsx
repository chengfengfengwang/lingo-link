import { getCollectWord } from "../utils";
import { useState, useEffect, useRef } from "react";
import type { Sww } from "@/types/words";
import Translate from "./Translate";
import Word from "./Word";
import { currentSelectionInfo } from "../utils";
import { removeWord, updateWord } from "@/storage/local";
import { removeWordApi, updateWordApi } from "@/api";
import { isWord } from "../utils";
import type { EngineValue, PostMessage } from "@/types";
import { allSentenceEngineList, allWordEngineList } from "@/utils/const";
import EngineDropdown from "./EngineDropdown";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "./FallbackComponent";
import { removeWordOulu } from "@/api/oulu";
import { isInPopup } from "@/utils";
import Login from "./Login";
import { showLogin } from "./Login";
import { useAtom } from "jotai";
import { addSwwAtom, settingAtom, swwListAtom } from "@/store";
import Browser from "webextension-polyfill";
import { setSession } from "@/storage/session";
import { createPortal } from "react-dom";
import CollectModal from "./CollectModal";
import CollectForm from "./CollectForm";
import { v4 as uuidv4 } from "uuid";
import { hasWord } from "../utils";
import { getLocal } from "@/storage/local";
import { toastManager } from "./Toast";

export default function TranslateContent({
  searchText,
  collectFormUpdate,
}: {
  searchText: string;
  collectFormUpdate: ({
    show,
    collectInfo,
  }: {
    show: boolean;
    collectInfo?: Partial<Sww> | undefined;
  }) => void;
}) {
  const [swwList] = useAtom(swwListAtom);
  const [,addSww] = useAtom(addSwwAtom);
  const [setting] = useAtom(settingAtom);
  const [collectInfo, setCollectInfo] = useState<Sww | undefined>(undefined);
  const [currentEngine, setCurrentEngine] = useState<EngineValue | null>(null);
  const [collectShow,setCollectShow] = useState(false);
  const [contentScriptWrapper,setContentScriptWrapper] = useState<HTMLDivElement|null>(null);
  const [translateV, setTranslateV] = useState(0);
  const [wordV, setWordV] = useState(0);
  const divRef = useRef<HTMLDivElement|null>(null);
  const fallbackComRef =
    useRef<React.ComponentRef<typeof FallbackComponent>>(null);
  
  useEffect(() => {
    const isWordResult = isWord({
      input: searchText,
      lang: setting.sourceLanguage?.language,
    });
    if (isWordResult) {
      const list = setting.wordEngineList ?? allWordEngineList;
      if (list && list instanceof Array && list.length) {
        setCurrentEngine(list[0].value);
      } else {
        setCurrentEngine(allWordEngineList[0].value);
      }
    } else {
      const list = setting.sentenceEngineList ?? allSentenceEngineList;

      if (list && list instanceof Array && list.length) {
        setCurrentEngine(list[0].value);
      } else {
        setCurrentEngine(allSentenceEngineList[0].value);
      }
    }
  }, [
    searchText,
    setting.wordEngineList,
    setting.sentenceEngineList,
    setting.sourceLanguage?.language,
  ]);
  useEffect(() => {
    fallbackComRef.current?.hideError();
  }, [currentEngine]);
  useEffect(() => {
    const result = getCollectWord({ word: searchText, swwList });
    setCollectInfo(result);
  }, [searchText, swwList]);

  const handleHeartClick = async () => {
    if (!setting.userInfo?.token) {
      if (isInPopup) {
        setSession({ showLogin: true });
        Browser.runtime.openOptionsPage();
      } else {
        showLogin();
      }
      return;
    }
    if (collectInfo) {
      removeWord({ word: searchText });
      removeWordApi(collectInfo.word);
      removeWordOulu(collectInfo.word);
    } else {
      const root = divRef.current?.getRootNode() as HTMLElement;
      setCollectShow(true);
      setContentScriptWrapper(root.querySelector('#orange-translator-container') as HTMLDivElement)
      //collectFormUpdate({ show: true, collectInfo: { word: searchText } });
    }
  };
  const handleMasterClick = () => {
    if (collectInfo?.masteryLevel === 1) {
      updateWord({ ...collectInfo, ...{ masteryLevel: 0 } });
      updateWordApi({ id: collectInfo.id, masteryLevel: 0 });
    } else {
      updateWord({ ...collectInfo!, ...{ masteryLevel: 1 } });
      updateWordApi({ id: collectInfo!.id, masteryLevel: 1 });
    }
  };
  const handleWeightChange = (num: number) => {
    if (!collectInfo) {
      return;
    }
    updateWord({ ...collectInfo, ...{ weight: num } });
    updateWordApi({ id: collectInfo.id, weight: num });
  };
  const handlePencilClick = () => {
    collectFormUpdate({ show: true, collectInfo });
  };
  const onRefresh = (type: "translate" | "word") => {
    if (type === "translate") {
      setTranslateV((pre) => ++pre);
    } else {
      setWordV((pre) => ++pre);
    }
  };

 const handleCollectSubmit = async (
  formValue:{word:string,context:string}
) => {
  let item: Sww | null = null;
  if (collectInfo) {
    item = {
      ...collectInfo,
      lastEditDate: Date.now(),
      ...formValue,
    };
    updateWord(item);
    updateWordApi(item);
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
    addSww(item);
  }
};
  const isWordResult = isWord({
    input: searchText,
    lang: setting.sourceLanguage?.language,
  });
  if (!currentEngine) {
    return null;
  }
  return (
    <div ref={divRef} className="max-h-[70vh] overflow-scroll">
      <EngineDropdown
        isWord={isWordResult}
        currentEngine={currentEngine}
        onChange={(engine) => setCurrentEngine(engine)}
        className={`absolute ${
          isInPopup
            ? "right-0 bg-gray-300/60 rounded-xl text-[11px] p-[3px] top-[0px]"
            : "right-16 text-[13px]"
        } top-[5px] z-10`}
      />

      <ErrorBoundary
        FallbackComponent={(fallbackProps) => (
          <FallbackComponent
            ref={fallbackComRef}
            fallbackProps={fallbackProps}
          />
        )}
      >
        {isWordResult ? (
          <Word
            onPencilClick={handlePencilClick}
            onMasterClick={handleMasterClick}
            onHeartClick={handleHeartClick}
            onWeightChange={handleWeightChange}
            collectInfo={collectInfo}
            searchText={searchText}
            currentEngine={currentEngine}
            onRefresh={() => onRefresh("word")}
            key={wordV}
          />
        ) : (
          <Translate
            currentEngine={currentEngine}
            onPencilClick={handlePencilClick}
            onMasterClick={handleMasterClick}
            onHeartClick={handleHeartClick}
            collectInfo={collectInfo}
            searchText={searchText}
            onRefresh={() => onRefresh("translate")}
            key={translateV}
          />
        )}
      </ErrorBoundary>
      <Login />
      {
        (contentScriptWrapper && collectShow) ? createPortal(<CollectModal>
          <CollectForm onSubmit={handleCollectSubmit} onCancel={()=>setCollectShow(false)} initialValue={{word:collectInfo?.word || currentSelectionInfo.word, context:collectInfo?.context || currentSelectionInfo.context}}></CollectForm>
        </CollectModal>, contentScriptWrapper) : null
      }
    </div>
  );
}
