import { ChangeEvent, type ClipboardEvent } from "react";
import ImgPreview from "./ImgUploaderPreview";
import { Paperclip } from "lucide-react";
import { collectInputRemarkAtom } from "@/store";
import { useImmerAtom } from "jotai-immer";

interface EditorProps {
  onCancel?: () => void;
  onlyText?: boolean;
}
export default function Editor({onCancel,onlyText}: EditorProps) {
  const [collectInputRemark, setCollectInputRemark] = useImmerAtom(collectInputRemarkAtom);

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    if (onlyText) {
      return;
    }
    const items = e.clipboardData.items;
    let blob: Blob | null = null;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        blob = items[i].getAsFile();
        break;
      }
    }
    if (blob) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setCollectInputRemark((draft) => {
          const imgs = draft?.imgs;
          draft.imgs = imgs ? [...imgs, e.target!.result as string] : [e.target!.result as string]
        })
      };
      reader.readAsDataURL(blob);
    }
  };
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setCollectInputRemark((draft) => {
          const imgs = draft?.imgs;
          draft.imgs = imgs ? [...imgs, e.target!.result as string] : [e.target!.result as string]
        })
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImg = (index: number) => {
    setCollectInputRemark((draft) => {
      draft.imgs = draft.imgs!.filter((_,idx) => idx !== index)
    })
  };
  
  return (
    <div>
      {!onlyText ? (
          <div className="flex items-center gap-1 mb-1">
            {collectInputRemark?.imgs?.map((base64, index) => (
                <div key={index}>
                  <ImgPreview
                    onclose={() => {
                      removeImg(index);
                    }}
                    src={base64}
                  />
                </div>
            ))}
          </div>
      ) : null}

      <div className="relative">
        <textarea
          value={collectInputRemark?.content}
          onChange={(e) => setCollectInputRemark((draft) => {draft.content = e.target.value})}
          onPaste={handlePaste}
          className="w-full min-h-[80px] focus:outline-none textarea textarea-bordered"
          placeholder=""
        ></textarea>
        <div className="flex items-center gap-2 absolute right-1 bottom-3">
          {!onlyText ? (
            <div className="relative btn btn-sm">
              <input
                multiple={false}
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 opacity-0"
                type="file"
              />
              <Paperclip width={18} />
            </div>
          ) : null}
          {onCancel ? (
            <div onClick={onCancel} className="btn btn-sm">
              cancel
            </div>
          ) : null}
          
        </div>
      </div>
    </div>
  );
}
