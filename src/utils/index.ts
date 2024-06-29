import type {
  BackgroundFetchParam,
  EngineValue,
  ExtensionMessage,
} from "@/types/index";
import type { Sww } from "@/types/words";
import { Message } from "@/types/chat";
import { createParser } from "eventsource-parser";
import type { CollinsWord } from "@/types/index";
export const formateText = (str: string) => {
  return str.replace(/\r\n/g, " ").replace(/\s+/g, " ");
};
export const preventBeyondWindow = ({
  boxWidth,
  boxHeight,
  domRect,
  gap,
}: {
  boxWidth: number;
  boxHeight: number;
  domRect: DOMRect;
  gap: number;
}) => {
  let x = domRect.right - domRect.width / 2 - boxWidth / 2 + window.scrollX;
  let y = domRect.top + domRect.height + window.scrollY + gap;

  if (x < 0) {
    x = 0;
  }
  if (x + boxWidth > window.innerWidth + window.scrollX) {
    x = window.innerWidth + window.scrollX - boxWidth;
  }
  if (y + boxHeight > window.innerHeight + window.scrollY) {
    y = window.scrollY + domRect.top - boxHeight - 20;
  }
  return { x, y };
};
export const isSameWord = (word1: string, word2: string) => {
  if (!word1 || !word2) {
    return false;
  }
  return word1.trim().toLocaleLowerCase() === word2.trim().toLocaleLowerCase();
};
export const getCollectWord = ({
  word,
  swwList,
}: {
  word: string;
  swwList: Sww[];
}) => {
  return swwList.find((item) => {
    return isSameWord(item.word, word);
  });
};
export const hasWord = ({
  word,
  swwList,
}: {
  word: string;
  swwList: Sww[];
}) => {
  return Boolean(
    swwList.find((item) => {
      return isSameWord(item.word, word);
    })
  );
};
export const backgroundFetch = async (param: BackgroundFetchParam) => {
  const { url, method, responseType } = param;
  const options: Record<string, any> = {
    method: method ?? "GET",
  };
  if (param.body) {
    options.body = param.body;
  }
  if (param.headers) {
    options.headers = param.headers;
  }
  return fetch(url, options).then(async (res) => {
    if (!res.ok) {
      return {
        error: "fetch failed",
      };
    }
    if (responseType === "dataURL") {
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          resolve(this.result);
        };
        reader.readAsDataURL(blob);
      });
    } else if (responseType === "text") {
      return await res.text();
    } else if (responseType === "json") {
      return await res.json();
    }
  });
};

export const sendBackgroundFetch = async (option: BackgroundFetchParam) => {
    const browser = (await import("webextension-polyfill")).default;
    const message: ExtensionMessage = {
      type: "fetch",
      payload: option,
    };
    return browser.runtime.sendMessage(message);
  
};
export function isWord({
  input,
  lang,
}: {
  input: string;
  lang: string | undefined;
}) {
  if (!input) {
    throw new Error("input is empty");
  }
  const text = input.trim();
  const sourceLanguage = lang ?? navigator.language;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { Segmenter } = Intl as any;
  if (!Segmenter && sourceLanguage.indexOf("en") !== -1) {
    if (input.split(" ").length === 1) {
      return true;
    } else {
      return false;
    }
  }
  if (!Segmenter) {
    return false;
  }
  const segmenter = new Segmenter(sourceLanguage, { granularity: "word" });
  const iterator = segmenter.segment(text)[Symbol.iterator]();
  return iterator.next().value?.segment === text;
}
export const formateMessage = (engine: EngineValue, messages: Message[]) => {
  if (engine === "wenxin") {
    return messages.map((item) => ({
      role: item.role === "system" ? "user" : item.role,
      content: item.content,
    }));
  }
  return messages;
};
export async function handleStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onData: (data: string) => void
) {
  const parser = createParser((event) => {
    if (event.type === "event") {
      onData(event.data);
    }
  });
  // eslint-disable-next-line
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const text = new TextDecoder().decode(value);
    parser.feed(text);
  }
}
function compressRatio({ width, height }: { width: number; height: number }) {
  const maxLimit = 500;
  if (width > maxLimit || height > maxLimit) {
    width = Math.floor(width * 0.8);
    height = Math.floor(height * 0.8);
    return compressRatio({ width, height });
  } else {
    return { width, height };
  }
}
export function compressImg(img: File) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const reader = new FileReader();
    reader.addEventListener("load", function (e) {
      const newImg = new Image();
      newImg.onload = function () {
        // let width = newImg.width;
        // let height = newImg.height;
        // if (newImg.width > 1000 || newImg.height > 1000) {
        //   width = width / 2;
        //   height = height / 2;
        // }
        const { width, height } = compressRatio({
          width: newImg.width,
          height: newImg.height,
        });
        canvas.width = width;
        canvas.height = height;
        ctx!.drawImage(newImg, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          function (blob) {
            resolve(blob);
          },
          "image/webp",
          0.8
        );
      };
      newImg.src = e.target!.result as string;
    });
    reader.readAsDataURL(img);
  });
}
export const isSelectionInEditElement = () =>
  document.activeElement instanceof HTMLTextAreaElement ||
  document.activeElement instanceof HTMLInputElement;
const iframeWindowManager = () => {
  let iframeWindow: MessageEventSource | undefined = undefined;
  return {
    getIframeWindow() {
      return iframeWindow;
    },
    setIframeWindow(param: MessageEventSource) {
      iframeWindow = param;
    },
  };
};
export const { getIframeWindow, setIframeWindow } = iframeWindowManager();
export const currentSelectionInfo: {
  word: string;
  context: string;
} = {
  word: "",
  context: "",
};
export const screenshot = async () => {
  const browser = (await import("webextension-polyfill")).default;
  const res = await browser.tabs.captureVisibleTab();
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const message: ExtensionMessage = {
    type: "onScreenDataurl",
    payload: res,
  };
  browser.tabs.sendMessage(tabs[0].id!, message);
};
export const getWindowSelectionInfo = async () => {
  const browser = (await import("webextension-polyfill")).default;
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const message: ExtensionMessage = {
    type: "getCurWindowSelectionInfo",
  };
  return await browser.tabs.sendMessage(tabs[0].id!, message);
};
export const parseCollins = (html: string) => {
  const result: CollinsWord = {
    phonetic: null,
    explains: [],
  };
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  const cobuildItms = Array.from(
    doc.querySelectorAll(".definitions.cobuild .hom")
  );
  (result.phonetic = doc.querySelector(".dictionary .pron")?.textContent),
    cobuildItms.forEach((item) => {
      result.explains.push({
        pos: item.querySelector(".gramGrp")?.textContent,
        def: item.querySelector(".def")?.textContent,
        examples: Array.from(item.querySelectorAll(".type-example"))?.map(
          (quote) => quote.textContent
        ),
      });
    });
  return result;
};
export const isInPopup = /extension/.test(location.protocol);
export function base64ToBlob(base64: string): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        function (blob) {
          resolve(blob!);
        },
        "image/webp",
        0.5
      );
    };
  });
}
