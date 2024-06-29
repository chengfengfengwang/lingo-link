import { useTranslation } from "react-i18next";
import Editor from "./Editor";
import { X } from "lucide-react";
import { collectInputBasicAtom } from "@/store";
import { useImmerAtom } from "jotai-immer";
import { useState } from "react";
export default function CollectForm({
  size,
  showCloseIcon,
  onCancel,
  onSubmit,
}: {
  size?: "sm" | "md";
  showCloseIcon?: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [collectSwwInfo, setCollectBasicInfo] = useImmerAtom(
    collectInputBasicAtom
  );
  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };
  return (
    <div className="relative text-[14px] grid grid-cols-1 gap-4">
      {showCloseIcon && (
        <div className="p-0 absolute z-10 right-0 top-0">
          <X
            onClick={onCancel}
            className="cursor-pointer  w-[18px] h-[18px]"
          ></X>
        </div>
      )}

      <label className="block">
        <span className="font-semibold">{t("Word to Save")}</span>
        <div className="flex items-center">
          <input
            required
            value={collectSwwInfo?.word ?? ""}
            onChange={(e) => {
              setCollectBasicInfo((draft) => {
                draft!.word = e.target.value;
              });
            }}
            type="text"
            placeholder="word"
            className={`placeholder:text-base-content/50 mt-1 input input-bordered w-full ${
              size === "sm" ? "input-sm" : ""
            }`}
          />
        </div>
      </label>
      <label className="block">
        <span className="font-semibold">
          {t("Sentence Containing the Word")}
        </span>
        <textarea
          required
          value={collectSwwInfo?.context}
          onChange={(e) => {
            setCollectBasicInfo((draft) => {
              draft!.context = e.target.value;
            });
          }}
          rows={2}
          className={`placeholder:text-base-content/50 block mt-1 w-full textarea textarea-bordered ${
            size === "sm" ? "textarea-sm" : ""
          }`}
          placeholder="context"
        ></textarea>
      </label>
      <label className="block">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{t("Remark")}</span>
          <span className="text-[12px]">
            目前笔记数据会在
            <a
              className="text-blue-500 underline"
              target="community"
              href="https://words.mywords.cc/recommend"
            >
              社区
            </a>
            公开
          </span>
        </div>
        <Editor />
      </label>
      <div className="flex justify-end items-center">
        <button
          onClick={onCancel}
          className={`btn ${size === "sm" ? "btn-sm" : ""}`}
        >
          {t("Cancel")}
        </button>
        <button
          disabled={!collectSwwInfo?.word || !collectSwwInfo.context || loading}
          onClick={handleSubmit}
          className={`${size === "sm" ? "btn-sm" : ""} btn btn-primary ml-2
                  `}
        >
          {loading ? <span className="loading loading-spinner"></span> : null}
          {t("Save")}
        </button>
      </div>
    </div>
  );
}
