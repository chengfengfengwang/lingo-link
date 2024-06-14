import { useEffect, useRef, useState } from "react";
export default function DropDown({
  content,
  trigger,
  onTriggerClick,
  autoClose=true
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  onTriggerClick?: (e:React.MouseEvent) =>void
  autoClose?:boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapper = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <span ref={wrapper} className="inline-block relative">
      <div onClick={(e) => {onTriggerClick && onTriggerClick(e);setIsOpen(!isOpen)}}>{trigger}</div>

      {isOpen && <div onClick={()=>{autoClose && setIsOpen(!isOpen)}}>{content}</div>  }
    </span>
  );
}
