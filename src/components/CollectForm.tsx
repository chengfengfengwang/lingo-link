import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CollectForm({
  size,
  showCloseIcon = true,
  initialValue,
  onCancel,
  onSubmit,
}: {
  size?: "sm" | "md";
  showCloseIcon?: boolean;
  initialValue?: {word:string,context:string}|undefined;
  onCancel: () => void;
  onSubmit: (params: {word:string,context:string}) => void;
}) {
  const { t } = useTranslation();
  const [word, setWord] = useState("");
  const [sentenceValue, setSentenceValue] = useState("");

  const handleSubmit = async () => {
    const formValue = {
      word,
      context: sentenceValue,
    };
    onSubmit(formValue);
  };

  useEffect(() => {
    if (initialValue?.word) {
      setWord(initialValue.word);
    }
    if (initialValue?.context) {
      setSentenceValue(initialValue.context);
    }
   
  }, [initialValue]);
  return (
    <div className="text-[14px]">
      {showCloseIcon && (
        <h2 className="flex items-center justify-end text-xl font-bold">
          <X
            onClick={onCancel}
            className="cursor-pointer  w-[18px] h-[18px]"
          ></X>
        </h2>
      )}

      <div className="grid grid-cols-1 gap-4">
        <label className="block">
          <span className="font-semibold">{t("Word to Save")}</span>
          <div className="flex items-center">
            <input
              required
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
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
            value={sentenceValue}
            onChange={(e) => setSentenceValue(e.target.value)}
            rows={2}
            className={`placeholder:text-base-content/50 block mt-1 w-full textarea textarea-bordered ${
              size === "sm" ? "textarea-sm" : ""
            }`}
            placeholder={t("Sentence Containing the Word")}
          ></textarea>
        </label>
        

        <div className="flex justify-end items-center">
          <button
            onClick={onCancel}
            className={`btn ${size === "sm" ? "btn-sm" : ""}`}
          >
            {t("Cancel")}
          </button>
          <button
            disabled={!word||!sentenceValue}
            onClick={handleSubmit}
            className={`${size === "sm" ? "btn-sm" : ""} btn btn-primary ml-2
                  `}
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
