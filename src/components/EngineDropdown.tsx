import { EngineValue, EngineItem } from "@/types";
import { allSentenceEngineList, allWordEngineList } from "@/utils/const";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";
export default function EngineDropdown({
  onChange,
  currentEngine,
  className,
  isWord,
}: {
  currentEngine: EngineValue;
  onChange: (engine: EngineValue) => void;
  className?: string;
  isWord: boolean;
}) {
  const [setting] = useAtom(settingAtom);
  const [dropdownState, setDropdownState] = useState<"open" | "close">("close");
  const [curEngineName, setCurEngineName] = useState("");
  const timer = useRef<number | null>(null);
  const handleChange = (item: EngineItem) => {
    onChange(item.value);
    setDropdownState("close");
  };
  const handleLabelMouseleave = () => {
    timer.current = window.setTimeout(() => {
      setDropdownState("close");
    }, 400);
  };
  const handleMouseenter = () => {
    timer.current && clearTimeout(timer.current);
    setDropdownState("open");
  };
  const handleContentMouseleave = () => {
    timer.current = window.setTimeout(() => {
      setDropdownState("close");
    }, 50);
  };
  const engines = isWord  ? (setting.wordEngineList ?? allWordEngineList).filter(
    (item) => item.checked
  ) : (setting.sentenceEngineList ?? allSentenceEngineList).filter(
    (item) => item.checked
  );

  useEffect(() => {
    const findItem = engines.find((item) => item.value === currentEngine);
    setCurEngineName(findItem?.name ?? "");
  }, [engines, currentEngine]);

  // return (
  //   <div className={`${className}`}>
  //     <ul className={`flex items-center space-x-1 text-[12px]`}>
  //       {engines.map((item) => (
  //         <li
  //           className={`cursor-pointer  px-1 py-[1px] rounded-md   ${
  //             currentEngine === item.value
  //               ? "bg-gray-300 text-black"
  //               : "hover:bg-gray-200"
  //           }`}
  //           onClick={() => handleChange(item)}
  //           // className={`btn btn-xs btn-ghost ${currentEngine === item.value ? 'border-b-2' : ''}`}
  //           key={item.value}
  //         >
  //           {item.name}
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
  return (
    <div className={`${className}`}>
      <div
        onMouseEnter={handleMouseenter}
        onMouseLeave={handleLabelMouseleave}
        className="cursor-pointer flex items-center"
      >
        <span>{curEngineName}</span>
        <ChevronDown className="stroke-2 w-[15px] h-[15px]" />
      </div>
      <ul
        onMouseEnter={handleMouseenter}
        onMouseLeave={handleContentMouseleave}
        className={`${dropdownState === "open" ? "visible" : "hidden"} ${
          engines.length > 2 && !isWord 
            ? "min-w-[220px] -right-[50px]"
            : "left-1/2 -translate-x-[50%]"
        } absolute  top-[100%] z-[1] p-1 shadow-xl bg-base-300 rounded-lg overflow-scroll`}
      >
        {engines.map((item) => (
          <li className={`inline-block  m-[1px]`} key={item.value}>
            <input
              onChange={() => handleChange(item)}
              type="radio"
              className="btn btn-xs btn-ghost"
              value={item.value}
              checked={item.value === currentEngine}
              aria-label={item.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
