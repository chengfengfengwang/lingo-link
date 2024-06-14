import { useEffect, useRef,useState } from "react";
import { sendBackgroundFetch } from "@/utils";
import type { YoudaoCollins } from "@/types/words";

function parseCollinsHTML(html:string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  // 获取所有翻译容器
  const transContainers = doc.querySelectorAll('#collinsResult .wt-container')
  const result = Array.from(transContainers).map((transContainer) => {
    //获取分类
    const category = transContainer
      .querySelector('.title.trans-tip span')
      ?.textContent?.trim()
      .toLowerCase()
    const phonetic = transContainer.querySelector('.phonetic')?.textContent?.trim()
    let star = 0
    const $star = transContainer.querySelector('.star')
    if ($star) {
      const starMatch = /star(\d+)/.exec(String($star.className))
      if (starMatch) {
        star = Number(starMatch[1])
      }
    }
    const rank = (transContainer.querySelector('.via.rank') as HTMLElement)?.innerText?.trim()
    const pattern = transContainer.querySelector('.additional.pattern')?.textContent?.trim()
    //在每个翻译容器中获取所有的单词解释
    const explanations = Array.from(transContainer.querySelectorAll('.ol > li')).map((li) => {
      //获取词性
      //获取词语解释，包含了英文和中文
      const explanation = (li.querySelector('.collinsMajorTrans p') as HTMLElement)?.innerText
        .replace(/\t|\n/g, '')
        .trim()
      // 获取例句。注意这里可能有多个例句
      const examples = Array.from(li.querySelectorAll('.examples p')).map((p) =>
        p.textContent?.trim() ?? '',
      )
      return {
        explanation,
        examples,
      }
    })
    const invalidIndex = explanations.findIndex((e) => !e.explanation)
    if (invalidIndex !== -1) {
      explanations.splice(invalidIndex, 1)
    }
    return {
      category,
      phonetic,
      star,
      rank,
      pattern,
      explanations,
    }
  })
  return result
}
const fetchWord = async ({
  text,
  beforeComplete,
  onComplete,
}: {
  text: string;
  beforeComplete: () => void;
  onComplete: () => void;
}) => {
  if (!text) {
    return null;
  }
  beforeComplete();
  try {
    const response = await sendBackgroundFetch({
      url:`https://dict.youdao.com/w/${text}`,
      responseType: "text",
    });
    
    if (!response) {
      return null;
    }    
    return response;
  } finally {
    onComplete();
  }
};
export default function useOldYoudao(searchText:string,lang:string){
  const timer = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState<YoudaoCollins>([]);
  useEffect(() => {
    if (lang !== 'en'){return}
    fetchWord({
      text: searchText,
      beforeComplete: () => {
        timer.current && clearTimeout(timer.current);
          timer.current = window.setTimeout(() => {
            setLoading(true);
          }, 500);
        
      },
      onComplete() {
        //if (isIgnore){return}
       timer.current && clearTimeout(timer.current);
       setLoading(false);
      },
    }).then((res) => {
      const data = parseCollinsHTML(res);      
      setWordData(data)
    });
  }, [searchText,lang]);
  return {loading,wordData}
}