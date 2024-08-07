import { HighlightName, LangCode, defaultSetting } from "@/utils/const";
import type { CommunityItemType, Sww } from "./words";

// export interface ExtensionMessage {
//   type: "fetch" | "auth" | "openOptions" | "captureScreen";
// }
export interface BackgroundFetchParam {
  url: string;
  method?: "GET" | "POST";
  responseType: "text" | "json" | "dataURL";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}
export type ExtensionMessage =
  | {
      type: "fetch";
      payload: BackgroundFetchParam;
    }
  | {
      type: "auth";
    }
  | {
      type: "openOptions";
    }
  | {
      type: "captureScreen";
    }
  | {
      type: "showCardAndPosition";
    }
  | {
      type: "onScreenDataurl";
      payload: string;
    }
  | {
      type: "getCurWindowSelectionInfo"
    }
  | {
    type: 'refreshLocalData'
  }
export type ExternalMessage = {
  type: 'getUser'
}
export interface User {
  picture?: string;
  name?: string;
  email: string;
  id: string;
  token: string;
  emailCode?: number;
  emailTime?: number;
}
export interface ExternalLink {
  id: string;
  name: string;
  link: string;
}
export type InterfaceLanguage = "en" | "zh";
export type OuluInfo = {
  token?: string;
  bookList?: { name: string; id: string; lang: string }[];
  targetBookId?: string;
  targetBookLang?: string;
  open?: boolean;
};
export interface Setting {
  userInfo?: User | null;
  openAIKey?: string;
  openAIAddress?: string;
  openAIModel?: string;
  showSelectionIcon?: boolean;
  engine?: EngineValue;
  geminiKey?: string;
  moonShotKey?: string;
  targetLanguage?: LangCode;
  sourceLanguage?: Language;
  interfaceLanguage?: InterfaceLanguage;
  autoPronounce?: boolean;
  triggerIcon?: string;
  triggerIconSize?: number;
  highlightColor?: string;
  highlightStyle?: HighlightName;
  wenxinToken?: string;
  availableEngines?: EngineItem[]; // old
  wordEngineList?: EngineItem[];
  sentenceEngineList?: EngineItem[];
  wordSystemPrompt?: string;
  wordUserContent?: string;
  sentenceSystemPrompt?: string;
  sentenceUserContent?: string;
  externalLinks?: ExternalLink[];
  ouluInfo?: OuluInfo;
  screenshotToken?: string;
  deepSeekApiKey?:string;
  deepLXAddress?:string;
  customAIAddress?:string;
  customAIModel?:string;
  customAIKey?:string;
  autoSaveWord?:boolean;
  shoutcut?:string
}
export interface Local {
  swwList?: Sww[];
  remarkList?:CommunityItemType[];
  openAIModelList?: { label: string; value: string }[];
}
export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}
export interface GoogleLoginError {
  error: string;
  error_description: string;
}
export interface Language {
  language: string;
  name: string;
  nameEn?: string;
}

export type AllEnginesArray = typeof defaultSetting.engineList;
export type EngineItem = AllEnginesArray[number];
export type EngineValue = (typeof defaultSetting.engineList)[number]["value"];
export type PostMessage =
  | {
      name: "swwListUpdate";
      payload: Sww[];
    }
  | {
      name: "userInfoUpdate";
      payload: User | undefined | null;
    }
  | {
      name: "showCard";
      payload: {
        mode: "practice" | "normal";
        text: string;
        context?: string;
        position?: {
          x: number;
          y: number;
        };
        domRect?: DOMRect;
      };
    }
  | {
      name: "hidePracticeCard";
    }
  | {
      name: "practiceWordNext";
    }
  | {
      name: "iframeOnload";
    }
  | {
      name: "fillCollectForm";
      payload: Partial<Pick<Sww, "id" | "context" | "word" | "remark">>;
    }
export type CollinsWord = {
  phonetic: string | null | undefined;
  explains: {
    pos: string | null | undefined;
    def: string | undefined | null;
    examples: (string | undefined | null)[];
  }[];
};
export interface CollectBasicInfo {
  word: string;
  context: string;
}
export type CollectRemarkInfo = CommunityItemType
