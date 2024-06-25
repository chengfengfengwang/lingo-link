import { useState, useCallback, useEffect } from "react";
import { toastManager } from "@/components/Toast";
import { RotateCcw } from "lucide-react";
import {
  allSentenceEngineList,
  allWordEngineList,
  defaultSetting,
} from "@/utils/const";
import { getLocal, setLocal } from "@/storage/local";
import { useTranslation } from "react-i18next";
import WordEngine from "./wordEngine";
import SentenceEngine from "./sentenceEngine";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";
export default function EnginesSetting() {
  const { t } = useTranslation();
  const [setting, setSetting] = useAtom(settingAtom);
  const [openAIModelList, setOpenAIModelList] = useState<
    { label: string; value: string }[]
  >([]);

  const [getOpenAIModelLoading, setOpenAIModelLoading] = useState(false);
  const getOpenAIModelList = useCallback(() => {
    if (!setting?.openAIKey) {
      return;
    }
    if (getOpenAIModelLoading) {
      return;
    }
    const controller = new AbortController();
    const address = setting?.openAIAddress ?? defaultSetting.openAIAddress;
    const url = address.replace("/v1/chat/completions", "/v1/models");
    setOpenAIModelLoading(true);
    fetch(`${url}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${setting.openAIKey}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toastManager.add({ type: "error", msg: res.error.message });
          throw new Error(res.error);
        }
        const list = res.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => a.created - b.created)
          .reverse()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => ({ label: item.id, value: item.id }));
        setOpenAIModelList(list);
        setLocal({ openAIModelList: list });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOpenAIModelLoading(false);
      });
    return controller;
  }, [setting?.openAIAddress, setting?.openAIKey, getOpenAIModelLoading]);
 
  useEffect(() => {
    getLocal().then((res): void => {
      if (res.openAIModelList) {
        setOpenAIModelList(res.openAIModelList);
      }
    });
  }, []);
  const availableEngines = [
    ...(setting?.wordEngineList ?? allWordEngineList),
    ...(setting?.sentenceEngineList ?? allSentenceEngineList),
  ].filter((item) => item.checked);


  return (
    <div className="space-y-9">
      <WordEngine />
      <SentenceEngine />
      {availableEngines.findIndex((engine) => engine.value === "openai") !==
        -1 && (
        <div>
          <div className="font-semibold text-[17px] mb-3">OpenAI</div>
          <div className="border rounded-xl p-9">
            <label>
              <div className="text-[15px] my-2">apiKey</div>
              <input
                onChange={(e) => {
                  setSetting({
                    openAIKey: e.target.value
                  })
                }}
                value={setting?.openAIKey ?? ""}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
            </label>
            <label>
              <div className="text-[15px] my-2">apiAddress</div>
              <input
                onChange={(e) => {
                  setSetting({
                    openAIAddress: e.target.value
                  })
                }}
                value={setting?.openAIAddress ?? defaultSetting.openAIAddress}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
            </label>
            <label>
              <div className="text-[15px] my-2">
                {t("Available models for the current key")}
              </div>
              <div
                className={`flex transition-opacity ${
                  getOpenAIModelLoading ? "opacity-50" : "opacity-100"
                }`}
              >
                <select
                  value={setting.openAIModel ?? defaultSetting.openAIModel}
                  onChange={(e) => {
                    setSetting({
                      openAIModel: e.target.value
                    })
                  }}
                  className="select select-bordered w-full flex-auto"
                >
                  {openAIModelList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={getOpenAIModelList}
                  className="btn btn-square ml-2"
                >
                  {getOpenAIModelLoading ? (
                    <span className="w-5 loading loading-spinner"></span>
                  ) : (
                    <RotateCcw className="w-5" />
                  )}
                </button>
              </div>
            </label>
          </div>
        </div>
      )}
      {availableEngines.findIndex((engine) => engine.value === "wenxin") !==
        -1 && (
        <div>
          <div className="font-semibold text-[17px] mb-3">文心一言</div>
          <div className="border rounded-xl p-9">
            <div className="text-[15px] my-2">
              <span>AccesToken</span>
              <a
                target="_blank"
                className="ml-3 text-xs underline text-indigo-400"
                href="https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilkkrb0i5"
              >
                {t("Method of acquisition")}
              </a>
            </div>
            <input
              onChange={(e) => {
                setSetting({
                  wenxinToken: e.target.value
                })
              }}
              value={setting?.wenxinToken ?? ""}
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
        </div>
      )}
      {availableEngines.findIndex((engine) => engine.value === "gemini") !==
        -1 && (
        <div>
          <div className="font-semibold text-[17px] mb-3">Gemini</div>
          <div className="border rounded-xl p-9">
            <div className="text-[15px] my-2">
              <span>apiKey</span>
              <a
                target="_blank"
                className="ml-3 text-xs underline text-indigo-400"
                href="https://ai.google.dev/tutorials/setup"
              >
                {t("Method of acquisition")}
              </a>
            </div>
            <input
              onChange={(e) => {
                setSetting({
                  geminiKey: e.target.value
                })
              }}
              value={setting?.geminiKey ?? ""}
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
        </div>
      )}
      {availableEngines.findIndex((engine) => engine.value === "moonshot") !==
        -1 && (
        <div>
          <div className="font-semibold text-[17px] mb-3">MoonShot</div>
          <div className="border rounded-xl p-9">
            <div className="text-[15px] my-2">
              <span>apiKey</span>
              <a
                target="_blank"
                className="ml-3 text-xs underline text-indigo-400"
                href="https://platform.moonshot.cn/docs/api-reference"
              >
                {t("Method of acquisition")}
              </a>
            </div>
            <input
              onChange={(e) => {
                setSetting({
                  moonShotKey: e.target.value
                })
              }}
              value={setting?.moonShotKey ?? ""}
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
        </div>
      )}
      {availableEngines.findIndex((engine) => engine.value === "deepseek") !==
        -1 && (
        <div>
          <div className="font-semibold text-[17px] mb-3">DeepSeek</div>
          <div className="border rounded-xl p-9">
            <div className="text-[15px] my-2">
              <span>apiKey</span>
              <a
                target="_blank"
                className="ml-3 text-xs underline text-indigo-400"
                href="https://platform.deepseek.com/docs"
              >
                {t("Method of acquisition")}
              </a>
            </div>
            <input
              onChange={(e) => {
                setSetting({
                  deepSeekApiKey: e.target.value
                })
              }}
              value={setting?.deepSeekApiKey ?? ""}
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
        </div>
      )}
      {availableEngines.findIndex((engine) => engine.value === "deeplx") !==
        -1 && (
        <div>
          <div className="font-semibold text-[17px] mb-3">DeepLX</div>
          <div className="border rounded-xl p-9">
          <div>
              <div className="text-[15px] my-2">apiAddress</div>
              <input
                onChange={(e) => {
                  setSetting({
                    deepLXAddress: e.target.value
                  })
                }}
                value={setting?.deepLXAddress ?? ''}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
      )}
      {availableEngines.findIndex((engine) => engine.value === "custom") !==
        -1 && (
        <div>
          <div className="flex items-center mb-3">
          <div className="font-semibold text-[17px]">Custom AI</div>
          <div className="ml-3 text-[12px] text-gray-500">API format need compatible with OpenAI</div>
          </div>
          <div className="border rounded-xl p-9">
          <div>
              <div className="text-[15px] my-2">apiAddress</div>
              <input
                onChange={(e) => {
                  setSetting({
                    customAIAddress: e.target.value
                  })
                }}
                value={setting?.customAIAddress ?? ''}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
              <div className="text-[15px] my-2">model</div>
              <input
                onChange={(e) => {
                  setSetting({
                    customAIModel: e.target.value
                  })
                }}
                value={setting?.customAIModel ?? ''}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
              <div className="text-[15px] my-2">apiKey</div>
              <input
                onChange={(e) => {
                  setSetting({
                    customAIKey: e.target.value
                  })
                }}
                value={setting?.customAIKey ?? ''}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
