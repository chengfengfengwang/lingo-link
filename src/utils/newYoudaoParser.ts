import type { WordData } from "@/types/words";

export function parseYouDaoHTML(html: string, lang: string): WordData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const getHTMLArray = <T extends Element>(selector: string) => {
    return Array.from(doc.querySelectorAll(selector) as NodeListOf<T>);
  };
  const phonetic: string[] = [];
  getHTMLArray<HTMLDivElement>(".per-phone").map((item) => {
    if (
      (item.firstElementChild as HTMLSpanElement | null)?.textContent === "英"
    ) {
      phonetic[0] =
        (item.querySelector(".phonetic") as HTMLSpanElement).textContent ?? "";
    }
    if (
      (item.firstElementChild as HTMLSpanElement | null)?.textContent === "美"
    ) {
      phonetic[1] =
        (item.querySelector(".phonetic") as HTMLSpanElement).textContent ?? "";
    }
  });
  let explains: {
    pos: string | undefined;
    trans: string;
  }[] = [];
  let examTags: string[] = [];
  // 中英
  if (lang === "en") {
    explains = getHTMLArray<HTMLLIElement>(
      ".trans-container .basic .word-exp"
    ).map((item) => {
      return {
        pos:
          (item.querySelector(".pos") as HTMLSpanElement | null)?.textContent ??
          "",
        trans:
          (
            (item.querySelector(".trans") as HTMLSpanElement) ||
            (item.querySelector(".trans-ce") as HTMLSpanElement)
          ).textContent ?? "",
      };
    });
    examTags = getHTMLArray<HTMLSpanElement>(".exam_type .exam_type-value").map(
      (item) => item.textContent ?? ""
    );
  }
  if (lang === "ja") {
    const tone = doc.querySelector(".head-content") as HTMLElement;
    if (tone) {
      phonetic.push(tone.textContent ?? "");
    }
    explains = getHTMLArray<HTMLElement>(".each-sense").map((item) => {
      return {
        pos:
          (item.querySelector(".pos-line") as HTMLSpanElement | null)
            ?.textContent ?? "",
        trans:
          (item.querySelector(".sense-ja") as HTMLSpanElement).textContent ??
          "",
      };
    });
  }
  if (lang === "ko") {
    explains = getHTMLArray<HTMLElement>(".tran-cont li.mcols").map((item) => {
      return {
        pos:
          (
            (item.querySelector(".kcPos") as HTMLSpanElement | null) ||
            (item.querySelector(".pos") as HTMLSpanElement | null)
          )?.textContent ?? "",
        trans:
          (
            (item.querySelector(".kcKey") as HTMLSpanElement) ||
            (item.querySelector(".ckKey") as HTMLSpanElement)
          ).textContent ?? "",
      };
    });
    const transContent = doc.querySelector(".trans-container .trans-content");
    if (transContent instanceof HTMLElement) {
      explains.push({
        pos: undefined,
        trans: transContent.textContent ?? "",
      });
    }
  }
  if (lang === "fr") {
    const tone = doc.querySelector(".phonetic") as HTMLElement;
    if (tone) {
      phonetic.push(tone.textContent ?? "");
    }
    explains = getHTMLArray<HTMLElement>(".tran-cont .word-exp").map((item) => {
      return {
        pos: undefined,
        trans:
          (item.querySelector(".word-pos") as HTMLSpanElement).textContent ??
          "",
      };
    });
    // const transContent = doc.querySelector(".trans-container .trans-content");
    // if (transContent instanceof HTMLElement) {
    //   explains.push({
    //     pos: undefined,
    //     trans: transContent.textContent
    //   })
    // }
  }
  // 英中
  // const ceWords = doc.querySelectorAll(
  //   ".trans-container li.word-exp-ce .trans-ce"
  // ) as NodeListOf<HTMLSpanElement>;
  // if (ceWords.length !== 0) {
  //   ceWords.forEach((item) => {
  //     explains.push({
  //       pos: undefined,
  //       trans: item.textContent,
  //     });
  //   });
  // }
  return {
    phonetic,
    explains,
    examTags,
  };
}
