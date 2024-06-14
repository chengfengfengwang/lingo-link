import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";

export default function ScreenshotSetting() {
  const { t } = useTranslation();
  const [setting,setSetting] = useAtom(settingAtom);
  
  return (
    <div className="w-[600px] space-y-5">
      <div>
        <div className=" mb-3 flex items-baseline space-x-2">
          <span className="font-semibold text-[17px]">百度通用文字识别</span>
          <div className="text-gray-500 text-xs flex items-center space-x-1">
            <Info className="w-[13px] h-[13px]" />
            <span>通用场景OCR/通用文字识别（标准版），每月1000次免费</span>
          </div>
        </div>

        <div className="border rounded-xl p-9">
          <div>
            <div className="text-[15px] my-2">
              <span>AccessToken</span>
              <a
                target="_blank"
                className="ml-3 text-xs underline text-indigo-400"
                href="https://console.bce.baidu.com/tools/#/api?product=AI&project=%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB&parent=%E9%89%B4%E6%9D%83%E8%AE%A4%E8%AF%81%E6%9C%BA%E5%88%B6&api=oauth%2F2.0%2Ftoken&method=post"
              >
                {t("Method of acquisition")}
              </a>
            </div>
            <input
              onChange={(e) => {
                setSetting({screenshotToken: e.target.value});
              }}
              value={setting.screenshotToken ?? ""}
              type="text"
              placeholder=""
              className="input input-bordered w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
