import { X } from "lucide-react";
import Draggable from "react-draggable";
import {
  defaultTranslateWidth,
  defaultTranslateMinHeight,
  defaultTranslateMaxWidth,
} from "@/utils/const";
import { useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import Browser from "webextension-polyfill";
import { ExtensionMessage } from "@/types";

export default function DragableWrapper({
  children,
  x,
  y,
  onmouseenter,
  onClose,
}: {
  children: React.ReactNode;
  x: number;
  y: number;
  onmouseenter: () => void;
  onClose: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const openOption = async () => {
    try {
      const message: ExtensionMessage = { type: "openOptions" };
      await Browser.runtime.sendMessage(message);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (onmouseenter) {
      const contentDom = contentRef.current;
      const handleMouseEnter = () => {
        onmouseenter();
      };
      contentDom?.addEventListener("mouseenter", handleMouseEnter);
      return () => {
        contentDom?.removeEventListener("mouseenter", handleMouseEnter);
      };
    }
  }, [onmouseenter]);
  return (
    <Draggable
      handle=".handle"
      nodeRef={nodeRef}
      defaultClassName="chat_cat_dragable"
      defaultClassNameDragging="chat_cat_dragable_dragging"
      defaultClassNameDragged="chat_cat_dragable_dragged"
    >
      <div
        ref={nodeRef}
        style={{
          left: x,
          top: y,
          width: defaultTranslateWidth,
          maxWidth: defaultTranslateMaxWidth,
          minHeight: defaultTranslateMinHeight,
          padding: 16,
        }}
        className={`group absolute bg-inherit max-h-[100vh] p-[5px] flex flex-col  rounded-xl shadow-[0_0_16px_0px_rgba(0,0,0,0.2)] text-[14px]  overflow-hidden z-[2147483647]`}
      >
        {/* <GripHorizontal
          className="handle opacity-0 group-hover:opacity-50 z-10"
          style={{
            position: "absolute",
            left: "50%",
            top: "-6px",
            transform: "translateX(-50%)",
            width: "38px",
            height: "38px",
            boxSizing: "border-box",
            cursor: "move",
            padding: "2px 10px",
          }}
        /> */}
        <div className="handle z-10 absolute left-0 top-0 bg-transparent w-full h-[30px]"></div>
        <div className="flex items-center absolute right-1 top-1 z-10">
          <Settings
            onClick={openOption}
            className="cursor-pointer  w-[24px] h-[24px] p-[4px]"
          />
          <X
            onClick={onClose}
            className="cursor-pointer  w-[24px] h-[24px] p-[4px]"
          />
        </div>
        <div className="text" ref={contentRef}>
          {children}
        </div>
      </div>
    </Draggable>
  );
}
