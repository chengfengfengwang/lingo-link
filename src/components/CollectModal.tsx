import Draggable from "react-draggable";
import { useRef } from "react";
import { X } from "lucide-react";
import { collectShowAtom } from "@/store";
import { useAtom } from "jotai";
export default function CollectModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [,setCollectShow] = useAtom(collectShowAtom);
  return (
    <Draggable
      handle=".modal_handle"
      nodeRef={nodeRef}
      defaultPosition={{ x: -250, y: -250 }}
      defaultClassName="chat_cat_dragable"
      defaultClassNameDragging="chat_cat_dragable_dragging"
      defaultClassNameDragged="chat_cat_dragable_dragged"
    >
      <div
        ref={nodeRef}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          padding: "20px 20px 20px 20px",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(0,0,0,.1)",
          width: "540px",
          zIndex: 2147483647,
          backgroundColor: "inherit",
          boxSizing: "border-box",
        }}
      >
        <div className="modal_handle  z-10 absolute left-0 top-0 bg-transparent w-full h-[30px]"></div>
        <div className="p-3 absolute z-10 right-0 top-0">
          <X
            onClick={()=>{setCollectShow(false)}}
            className="cursor-pointer  w-[18px] h-[18px]"
          ></X>
        </div>
        <div>{children}</div>
      </div>
    </Draggable>
  );
}
