import { useEffect, useRef, useState } from "react";

export default function ContentMore({
  children,
  lines = 5,
}: {
  children: React.ReactNode;
  lines?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  useEffect(()=>{
    if (!contentRef.current){return}
    const style = window.getComputedStyle(contentRef.current);
    const lineHeight = style.lineHeight;
    if (contentRef.current.scrollHeight > parseFloat(lineHeight) * lines){
      setShowMore(true)
    } else {
      //setShowMore(true)
    }
  }, [children,lines])
  return (
    <>
      <div
        style={
         
            { WebkitLineClamp: showMore ? lines : 'unset', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: "hidden" }
        }
        ref={contentRef}
      >
        {children}
      </div>
      {
        showMore ? <div onClick={() => setShowMore(false)} className="text-blue-500 cursor-pointer">
        show more
      </div> : null
      }
      
    </>
  );
}
