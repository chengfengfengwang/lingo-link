import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react"
import { getWindowSelectionInfo } from "@/utils";
//import { useCardContext } from '@/context/cardContext'
// import useActionList from '@/hooks/useActionList'

export default function PopupInput ({
  onSubmit,
  placeholder,
}: {
  onSubmit: (msg: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = () => {
    if (value.trim() === "") return;
    onSubmit(value.trim());
    //setValue("");
  };
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    setValue(value);
  };
  useEffect(()=> {
    getWindowSelectionInfo().then(res => {
      if ((typeof res === 'object') && res !== null && 'word' in res) {
        setValue(res.word as string)
      }
    })
  }, [])
  useEffect(() => {
    if (textareaRef.current) {
      if (value) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight+2}px`;
        if (textareaRef.current.scrollHeight > 150) {
          textareaRef.current.style.overflowY = "scroll";
        }
      } else {
        textareaRef.current.style.height = 'auto';
        //textareaRef.current.style.height = `24px`;
      }
    }
  }, [value]);
  // useEffect(()=>{        
  //   if (!value.trim()){return}
  //   if (isWord({input:value, lang: setting.sourceLanguage?.language})) {
  //     if (lastEngine === null){
  //       if (setting.wordEngineList && !setting.wordEngineList[0].isChat) {
  //         onSubmit(value.trim());
  //         setShowSubmitBtn(false)
  //       }
  //       return
  //     }
  //     if (lastEngine === 'google' || lastEngine === 'youdao' || lastEngine === 'collins' || lastEngine === 'deeplx') {        
  //       onSubmit(value.trim());
  //       setShowSubmitBtn(false)
  //     } else {
  //       setShowSubmitBtn(true)
  //     }
  //   } else {
  //     if (lastEngine === null){
  //       if (setting.sentenceEngineList && !setting.sentenceEngineList[0].isChat) {
  //         onSubmit(value.trim());
  //         setShowSubmitBtn(false)
  //       }
  //       return
  //     }
      
  //     if (lastEngine === 'google' || lastEngine === 'youdao' || lastEngine === 'collins' || lastEngine === 'deeplx') {        
  //       onSubmit(value.trim());
  //       setShowSubmitBtn(false)
  //     } else {        
  //       setShowSubmitBtn(true)
  //     }
  //   }
  // }, [lastEngine,value,onSubmit,setting.sourceLanguage?.language,setting.wordEngineList,setting.sentenceEngineList])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`relative text-[14px]  transition  rounded-md`}>
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ? placeholder : ""}
        className="border border-slate-300 rounded-md leading-5  w-full outline-none focus:outline-none p-[4px] m-0"
        autoFocus
      ></textarea>
      {
        value && <div onClick={handleSubmit} className="flex flex-row-reverse">
        <button className="btn btn-xs gap-1"><Send className="w-3" />Submit</button>
      </div>
      }
      
    </div>
  );
}
