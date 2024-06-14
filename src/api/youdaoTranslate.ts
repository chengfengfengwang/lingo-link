import { formateText, sendBackgroundFetch } from "@/utils";
import type { Language } from "@/types";
const youdaoSupportLang = ['zh','en', 'ja', 'ko', 'fr'];
export default async function youdaoTranslate({
  text,
  source,
  target,
}: {
  text: string;
  source: string;
  target:string;
}) {
  try {
    let fetchSource = source;
    if (fetchSource === 'zh') {
      fetchSource = target
    }
    if (!youdaoSupportLang.includes(fetchSource)) {
      throw new Error(`youdao don\'t support ${fetchSource} as the learn language`);
    }
    const url = `https://www.youdao.com/result?word=${formateText(
      text
    )}&lang=${fetchSource}`;
    const data = await sendBackgroundFetch({
      url,
      responseType: "text",
    });
    return parseYouDaoTranslateHTML(data);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw "failed fetch";
    }
  }
}

export function parseYouDaoTranslateHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");  
  let resultContainer: HTMLElement | null = null;
  resultContainer = doc.querySelector(".trans-content") || doc.querySelector(".trans");

  // switch (lang) {
  //   case "en":
  //     resultContainer = doc.querySelector(".trans-content");
  //     break;
  //   case "ja":
  //     resultContainer = doc.querySelector(".trans-content");
  //     break;
  //   case "ko":
  //     resultContainer = doc.querySelector(".trans-content");
  //     break;
  //   case "fr":
  //     resultContainer = doc.querySelector(".trans-content");
  //     break;
  //   case "zh":
  //     resultContainer = doc.querySelector(".trans-content");
  //     break;
  //   default:
  //     resultContainer = doc.querySelector(".trans-content");
  //     break;
  // }
  return resultContainer?.textContent ?? "no content";
}
export const languages: Language[] = [
  {
    language: "zh",
    name: "Chinese",
  },
  {
    language: "fr",
    name: "French",
  },
  {
    language: "en",
    name: "English",
  },
  {
    language: "ko",
    name: "Korean",
  },
  {
    language: "ja",
    name: "Japanese",
  },
];
