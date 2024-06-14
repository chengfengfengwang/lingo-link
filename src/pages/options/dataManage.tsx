import { useTranslation } from "react-i18next";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toastManager } from "@/components/Toast";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";
const ouluLang = [
  {
    name: "English",
    value: "en",
  },
  {
    name: "French",
    value: "fr",
  },
  {
    name: "Deutsch",
    value: "de",
  },
  {
    name: "Spanish",
    value: "es",
  },
];

export default function DataManage() {
  const { t } = useTranslation();
  const [setting, setSetting] = useAtom(settingAtom);
  const [booksLoading, setBooksLoading] = useState(false);
  const ouluInfo = setting.ouluInfo;
  const getBookList = () => {
    if (booksLoading) {
      return;
    }
    if (!ouluInfo?.token) {
      toastManager.add({
        type: "error",
        msg: "授权token为空",
      });
      return;
    }
    if (!ouluInfo?.targetBookLang) {
      toastManager.add({
        type: "error",
        msg: "生词本语言为空",
      });
      return;
    }
    setBooksLoading(true);
    fetch(
      `https://api.frdic.com/api/open/v1/studylist/category?language=${ouluInfo.targetBookLang}`,
      {
        headers: {
          Authorization: ouluInfo.token,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setSetting({ ouluInfo: { ...ouluInfo, bookList: res.data } });
      })
      .finally(() => {
        setBooksLoading(false);
      });
  };
  return (
    <div className="w-[600px] space-y-5">
      <div>
        <div className="font-semibold text-[17px] mb-3">{t("Oulu Dic")}</div>
        <div className="border rounded-xl p-9">
          <div>
            <div className="text-[15px] my-2">
              <span>{t("Oulu Token")}</span>
              <a
                target="_blank"
                className="ml-3 text-xs underline text-indigo-400"
                href="https://my.eudic.net/OpenAPI/Authorization"
              >
                {t("Method of acquisition")}
              </a>
            </div>
            <input
              onChange={(e) => {
                setSetting({
                  ouluInfo: { ...ouluInfo, token: e.target.value },
                });
              }}
              value={ouluInfo?.token ?? ""}
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <div className="text-[15px] my-2">
              {t("Oulu Learning Language")}
            </div>
            <select
              value={ouluInfo?.targetBookLang ?? ""}
              onChange={(e) => {
                setSetting({
                  ouluInfo: { ...ouluInfo, targetBookLang: e.target.value },
                });
              }}
              className="select select-bordered w-full flex-auto"
            >
              <option disabled value={""}>
                Please Select
              </option>
              {ouluLang.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[15px] my-2">{t("Vocabulary Notebook")}</div>
            <div
              className={`flex transition-opacity ${
                booksLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              <select
                value={ouluInfo?.targetBookId ?? ""}
                onChange={(e) => {
                  setSetting({
                    ouluInfo: { ...ouluInfo, targetBookId: e.target.value },
                  });
                }}
                className="select select-bordered w-full flex-auto"
              >
                <option disabled value={""}>
                  Please Select
                </option>
                {ouluInfo?.bookList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button onClick={getBookList} className="btn btn-square ml-2">
                {booksLoading ? (
                  <span className="w-5 loading loading-spinner"></span>
                ) : (
                  <RotateCcw className="w-5" />
                )}
              </button>
            </div>
            <div className="">
              <div className="my-2">{t("Synchronization Status")}</div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSetting({
                      ouluInfo: { ...ouluInfo, open: e.target.checked },
                    });
                  }}
                  checked={ouluInfo?.open ?? false}
                  className="checkbox"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
