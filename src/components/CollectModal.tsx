import Draggable from "react-draggable";
import { GripHorizontal } from "lucide-react";
import { useRef } from "react";

export default function CollectModal({children}:{children:React.ReactNode}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <Draggable
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
        <GripHorizontal
          style={{
            position: "absolute",
            left: "50%",
            top: "6px",
            transform: "translateX(-50%)",
            width: "38px",
            height: "38px",
            boxSizing: "border-box",
            opacity: ".5",
            cursor: "move",
            padding: "10px",
          }}
        />
        <div>
       {children}
        </div>
      </div>
    </Draggable>
  );
}
