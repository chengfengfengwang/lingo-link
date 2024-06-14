import { useEffect, useRef,useState } from "react";
import { sendBackgroundFetch } from "@/utils";
import { parseYouDaoHTML } from "@/utils/newYoudaoParser";
import type { WordData } from "@/types/words";
import { getSetting } from "@/storage/sync";
import { defaultSetting } from "@/utils/const";
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
    const sourceLanguage = (await getSetting()).sourceLanguage?.language ?? defaultSetting.sourceLanguage.language;
    const response = await sendBackgroundFetch({
      //url: `https://dict.youdao.com/w/${text}`,
      url:`https://www.youdao.com/result?word=${text}&lang=${sourceLanguage}`,
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
export default function useYoudao(searchText:string,lang:string){
  const timer = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState<WordData|null>(null);
  useEffect(() => {
    // let isIgnore = false;
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
      //if (isIgnore){return}
      const data = parseYouDaoHTML(res, lang);
      if (data.explains.length === 0) {
        // baiduDetectLang(searchText).then(res => {
        //   //if (res)
        // })
      }
      setWordData(data)
    });
    return () => {
      //isIgnore = true;
      //timer.current && clearTimeout(timer.current);
    }
  }, [searchText,lang]);
  return {loading,wordData}
}