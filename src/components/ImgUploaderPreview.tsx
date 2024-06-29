import { PlusSquare, X } from "lucide-react";
export default function ImgUploaderPreview({ src,onclose }: { src?: string,onclose?:()=>void }) {
  return (
    <div className="group relative w-[70px] h-[70px]">
      <div onClick={(e)=>{e.stopPropagation(); onclose && onclose()}} className="group-hover:block hidden absolute cursor-pointer -right-[6px] -top-[6px] border bg-gray-100 p-1 rounded-full overflow-hidden">
        <X className="w-[12px] h-[12px] opacity-100" />
      </div>
      <div className=" cursor-pointer border overflow-hidden rounded-lg w-full h-full">
        {src ? (
          <img className="w-full h-full object-cover" src={src} alt="" />
        ) : (
          <PlusSquare />
        )}
      </div>
    </div>
  );
}
