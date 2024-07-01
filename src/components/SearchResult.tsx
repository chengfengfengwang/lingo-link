import { getCollectWord } from "../utils";
import { useState, useEffect, useRef } from "react";
import type { CommunityItemType, CommunityType, Sww } from "@/types/words";
import Translate from "./Translate";
import Word from "./Word";
import { currentSelectionInfo } from "../utils";
import { isWord } from "../utils";
import type { CollectRemarkInfo, EngineValue } from "@/types";
import { allSentenceEngineList, allWordEngineList } from "@/utils/const";
import EngineDropdown from "./EngineDropdown";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "./FallbackComponent";
import { isInPopup } from "@/utils";
import Login from "./Login";
import { showLogin } from "./Login";
import { useAtom } from "jotai";
import {
  addSwwAtom,
  removeSwwAtom,
  updateSwwItemAtom,
  settingAtom,
  swwListAtom,
  collectShowAtom,
  collectInputBasicAtom,
  collectInputRemarkAtom,
  remarkListAtom,
} from "@/store";
import Browser from "webextension-polyfill";
import { setSession } from "@/storage/session";
import { createPortal } from "react-dom";
import CollectModal from "./CollectModal";
import CollectForm from "./CollectForm";
import { v4 as uuidv4 } from "uuid";
import { hasWord } from "../utils";
import {
  getLocal,
  addRemark,
  removeRemark,
  updateRemark,
} from "@/storage/local";
import { toastManager } from "./Toast";
import {
  addCommunity,
  deleteCommunity,
  editItemContent,
  uploadMultiBase64,
} from "@/api";
import { useImmerAtom } from "jotai-immer";

export default function TranslateContent({
  searchText,
}: {
  searchText: string;
}) {
  const [swwList] = useAtom(swwListAtom);
  const [, addSww] = useAtom(addSwwAtom);
  const [, removeSww] = useAtom(removeSwwAtom);
  const [, updateSww] = useAtom(updateSwwItemAtom);
  const [setting] = useAtom(settingAtom);
  const [remarkList, setRemarkList] = useImmerAtom(remarkListAtom);
  const [collectInputBasic, setCollectBasicInfo] = useAtom(
    collectInputBasicAtom
  );
  const [collectInputRemark, setCollectInputRemark] = useAtom(
    collectInputRemarkAtom
  );
  const [currentEngine, setCurrentEngine] = useState<EngineValue | null>(null);
  const [wordCollectInfo, setCurrentCollect] = useState<Sww | undefined>(
    undefined
  );
  const [wordRemarkInfo, setWordRemarkInfo] = useState<
    Partial<CommunityItemType>
  >({});
  const [collectShow, setCollectShow] = useAtom(collectShowAtom);
  const [contentScriptWrapper, setContentScriptWrapper] =
    useState<HTMLDivElement | null>(null);
  const [translateV, setTranslateV] = useState(0);
  const [wordV, setWordV] = useState(0);
  const divRef = useRef<HTMLDivElement | null>(null);
  const fallbackComRef =
    useRef<React.ComponentRef<typeof FallbackComponent>>(null);
  const showCollectForm = () => {
    if (isInPopup) {
      setCollectShow(true);
    } else {
      const root = divRef.current?.getRootNode() as HTMLElement;
      setCollectShow(true);
      setContentScriptWrapper(
        root.querySelector("#orange-translator-container") as HTMLDivElement
      );
    }
  };
  useEffect(() => {
    const isWordResult = isWord({
      input: searchText,
      lang: setting.sourceLanguage?.language,
    });
    if (isWordResult) {
      const list = setting.wordEngineList ?? allWordEngineList;
      if (list && list instanceof Array && list.length) {
        setCurrentEngine(list.filter((item) => item.checked)[0].value);
      } else {
        setCurrentEngine(allWordEngineList[0].value);
      }
    } else {
      const list = setting.sentenceEngineList ?? allSentenceEngineList;
      if (list && list instanceof Array && list.length) {
        setCurrentEngine(list.filter((item) => item.checked)[0].value);
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
    setCurrentCollect(result);
    setCollectBasicInfo(
      result
        ? { word: result.word, context: result.context! }
        : {
            word: currentSelectionInfo.word,
            context: currentSelectionInfo.context,
          }
    );
  }, [searchText, swwList, setCollectBasicInfo]);
  useEffect(() => {
    if (searchText) {
      const recentRemark = remarkList.filter(
        (item) => item.word === searchText
      )[0];
      setWordRemarkInfo(recentRemark ?? {});
      setCollectInputRemark(recentRemark ?? {});      
    } else {
      setWordRemarkInfo({});
      setCollectInputRemark({} as CollectRemarkInfo);
    }
  }, [searchText, setCollectInputRemark, remarkList]);
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
    if (wordCollectInfo?.id) {
      removeSww(wordCollectInfo);
    } else {
      showCollectForm();
    }
  };
  const handleMasterClick = () => {
    const newLevel = wordCollectInfo?.masteryLevel === 1 ? 0 : 1;
    updateSww({ ...wordCollectInfo!, ...{ masteryLevel: newLevel } });
  };
  const handleWeightChange = (num: number) => {
    if (!wordCollectInfo) {
      return;
    }
    updateSww({ ...wordCollectInfo, ...{ weight: num } });
  };
  const handlePencilClick = () => {
    showCollectForm();
  };
  const onRefresh = (type: "translate" | "word") => {
    if (type === "translate") {
      setTranslateV((pre) => ++pre);
    } else {
      setWordV((pre) => ++pre);
    }
  };

  const handleCollectSubmit = async () => {
    let item: Sww | null = null;
    if (
      collectInputBasic &&
      wordCollectInfo &&
      collectInputBasic.word !== wordCollectInfo?.word &&
      collectInputBasic.context !== wordCollectInfo?.context
    ) {
      item = {
        ...wordCollectInfo,
        lastEditDate: Date.now(),
        ...collectInputBasic,
      };
      updateSww(item);
    }
    if (!wordCollectInfo && collectInputBasic) {
      if (
        hasWord({ word: searchText, swwList: (await getLocal()).swwList ?? [] })
      ) {
        toastManager.add({ type: "error", msg: "the word already existed" });
        return;
      }
      item = {
        id: uuidv4(),
        lastEditDate: Date.now(),
        ...collectInputBasic,
      };
      addSww(item);
    }
    // remark section

    if (
      wordRemarkInfo.id &&
      !collectInputRemark.content &&
      !collectInputRemark?.imgs?.length
    ) {
      deleteCommunity({ id: wordRemarkInfo.id });
      setRemarkList((draft) => {
        const index = draft.findIndex((item) => item.id === wordRemarkInfo.id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      });
      removeRemark({ id: wordRemarkInfo.id });
    }
    
    if (
      wordRemarkInfo.id &&
      (collectInputRemark.content || collectInputRemark?.imgs?.length)
    ) {
      let urls: string[] = [];
      if (collectInputRemark?.imgs && collectInputRemark?.imgs.length) {
        urls = await uploadMultiBase64(collectInputRemark.imgs);
      }
      const editItem = {
        id: wordRemarkInfo.id,
        word: collectInputBasic!.word,
        context: collectInputBasic!.context,
        author: setting.userInfo!.email,
        type: 'remark' as CommunityType,
        content: collectInputRemark?.content ?? "",
        imgs: urls,
        lastEditDate: Date.now(),
      };
      editItemContent(editItem);
      setRemarkList((draft) => {
        const index = draft.findIndex(
          (item) => item.id === collectInputRemark.id
        );
        if (index !== -1) {
          draft[index].imgs = urls;
          draft[index].content = collectInputRemark?.content ?? "";
          draft[index].lastEditDate = Date.now();
        }
      });
      updateRemark(editItem);
    }
    if (!wordRemarkInfo.id && (collectInputRemark.content || collectInputRemark.imgs?.length)) {
      let urls: string[] = [];
      if (collectInputRemark?.imgs && collectInputRemark?.imgs?.length) {
        urls = await uploadMultiBase64(collectInputRemark.imgs);
      }
      const communityItem: CommunityItemType = {
        id: uuidv4(),
        word: wordCollectInfo?.word || currentSelectionInfo.word || searchText,
        context: wordCollectInfo?.context || currentSelectionInfo.context || searchText,
        author: setting.userInfo!.email,
        content: collectInputRemark.content ?? '',
        imgs: urls,
        lastEditDate: Date.now(),
        type: "remark" as CommunityType,
      };
      addCommunity(communityItem);
      setRemarkList((draft) => {
        draft.push(communityItem);
      });
      addRemark(communityItem);
    }
    setCollectShow(false);
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
            collectInfo={wordCollectInfo}
            remarkInfo={wordRemarkInfo}
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
            collectInfo={wordCollectInfo}
            remarkInfo={wordRemarkInfo}
            searchText={searchText}
            onRefresh={() => onRefresh("translate")}
            key={translateV}
          />
        )}
      </ErrorBoundary>
      <Login />
      {!isInPopup && contentScriptWrapper && collectShow
        ? createPortal(
            <CollectModal>
              <CollectForm
                onSubmit={handleCollectSubmit}
                onCancel={() => setCollectShow(false)}
              ></CollectForm>
            </CollectModal>,
            contentScriptWrapper
          )
        : null}
      {isInPopup && collectShow
        ? createPortal(
            <div className="p-3">
              <CollectForm
                size="sm"
                showCloseIcon={true}
                onSubmit={handleCollectSubmit}
                onCancel={() => setCollectShow(false)}
              ></CollectForm>
            </div>,
            document.querySelector("#collect-wrapper")!
          )
        : null}
    </div>
  );
}
