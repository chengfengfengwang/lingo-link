import type { InterfaceLanguage } from "@/types";
import {
  AllLanguage,
  LangCode,
  SourceLanguage,
  defaultSetting, highlightStyles,
} from "@/utils/const";
import Login, { showLogin } from "@/components/Login";
import { useEffect } from "react";
import { setLocal } from "@/storage/local";
import { useTranslation } from "react-i18next";
import { getSession, setSession } from "@/storage/session";
import triggerIcon from "@/assets/trigger.png";
import { upload } from "@/api";
import browser from "webextension-polyfill";
import type { Storage } from "webextension-polyfill";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";

const defaultTriggerUrl = new URL(triggerIcon, import.meta.url).href;
export default function Options() {
  const { t, i18n } = useTranslation();
  const [setting, setSetting] = useAtom(settingAtom);
  const handleSourceLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const item = AllLanguage.find((sub) => sub.language === e.target.value);
    setSetting({ sourceLanguage: item });
  };
  useEffect(() => {
    getSession().then((res) => {
      if (res.showLogin) {
        setTimeout(() => {
          showLogin();
        }, 100);
        setSession({ showLogin: false });
      }
    });
    const handleSessionChange = (
      changes: Storage.StorageAreaOnChangedChangesType
    ) => {
      if (changes.showLogin && changes.showLogin.newValue) {
        setTimeout(() => {
          showLogin();
        }, 100);
        setSession({ showLogin: false });
      }
    };
    browser.storage.session.onChanged.addListener(handleSessionChange);

    return () => {
      browser.storage.session.onChanged.removeListener(handleSessionChange);
    };
  }, []);
  useEffect(() => {
    if (setting.interfaceLanguage !== i18n.language) {
      i18n.changeLanguage(
        setting.interfaceLanguage ?? defaultSetting.interfaceLanguage
      );
    }
  }, [i18n, setting.interfaceLanguage]);

  const toogleLogIn = () => {
    if (!setting.userInfo?.email) {
      showLogin();
    } else {
      setSetting({userInfo: null});
      setLocal({ swwList: [] });
    }
  };

  const changeI18nLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const json = await upload(file);
      const url = "https://r2.mywords.cc/" + json.key;
      setSetting({
        triggerIcon: url
      });
    }
  };
  return (
    <div>
      <div className="grid grid-cols-1 gap-9">
        <div>
          {<div className="font-semibold text-[17px] mb-2">{t("Account")}</div>}
          <div>
            {
              <span className="mr-2">
                {setting.userInfo?.email || t("Not Logged In State")}
              </span>
            }
            <button
              onClick={toogleLogIn}
              className={`btn btn-sm ${
                !setting.userInfo?.email ? "btn-primary" : ""
              }`}
            >
              {setting.userInfo?.email ? t("Sign out") : t("Sign in")}
            </button>
          </div>
        </div>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Display Trigger Icon After Highlighting Text")}
          </div>
          <div className="flex items-center">
            <input
                type="checkbox"
                onChange={(e) => {
                  setSetting({
                    showSelectionIcon: e.target.checked,
                  });
                }}
                checked={
                    setting.showSelectionIcon ?? defaultSetting.showSelectionIcon
                }
                className="checkbox"
            />
          </div>
        </label>
        <div>
          <div className="font-semibold text-[17px] mb-2">
            {t("Trigger Icon")}
          </div>
          <div className="flex items-center">
            <label className="w-[70px] h-[70px] relative group">
              <img
                  className="w-full"
                  src={setting.triggerIcon ?? defaultTriggerUrl}
                  alt=""
              />
              <input
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  className="hidden"
              />
              <div className="group-hover:opacity-100 opacity-0 cursor-pointer absolute inset-0 text-white/80 bg-black/50 z-10 flex items-center justify-center">
                {t("upload")}
              </div>
            </label>
          </div>
        </div>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Trigger Icon Size")}
          </div>
          <div className="flex items-center">
            <input
              onChange={(e) => {
                setSetting({
                  triggerIconSize: Number(e.target.value),
                });
              }}
              value={setting.triggerIconSize ?? defaultSetting.triggerIconSize}
              className="input input-bordered"
              type="number"
            />
          </div>
        </label>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Highlight Color")}
          </div>
          <div className="flex items-center">
            <input
                type="color"
                className="rounded-sm"
                value={setting.highlightColor ?? defaultSetting.highlightColor}
                onChange={(e) => {
                  setSetting({
                    highlightColor: e.target.value,
                  });
                }}
            />
          </div>
        </label>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Highlight Style")}
          </div>
          <select
              value={setting.highlightStyle ?? defaultSetting.highlightStyle}
              onChange={(e) => {
                setSetting({
                  highlightStyle: e.target.value,
                });
              }}
              className="select select-bordered w-full"
          >
            {highlightStyles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
            ))}
          </select>
        </label>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Automatically pronounce the word when looking it up")}
          </div>
          <div className="flex items-center">
            <input
                type="checkbox"
                onChange={(e) => {
                  setSetting({
                    autoPronounce: e.target.checked,
                  });
                }}
                checked={setting.autoPronounce}
                className="checkbox"
            />
          </div>
        </label>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Interface Language")}
          </div>
          <select
              value={
                  setting.interfaceLanguage ?? defaultSetting.interfaceLanguage
              }
              onChange={(e) => {
                changeI18nLang(e.target.value);
                setSetting({
                  interfaceLanguage: e.target.value as InterfaceLanguage,
                });
              }}
              className="select select-bordered w-full"
          >
            <option value={"zh"}>简体中文</option>
            <option value={"en"}>English</option>
          </select>
        </label>
        <div>
          <div className="font-semibold text-[17px] mb-2">
            {t("Language to be Translated")}
          </div>
          <div className="flex space-x-5">
            <select
                value={
                    setting.sourceLanguage?.language ??
                    defaultSetting.sourceLanguage.language
                }
                onChange={handleSourceLanguageChange}
                className="select select-bordered w-full"
            >
              {SourceLanguage.map((item) => (
                <option key={item.language} value={item.language}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label>
          <div className="font-semibold text-[17px] mb-2">
            {t("Native Language")}
          </div>
          <select
              value={setting.targetLanguage ?? defaultSetting.targetLanguage}
              onChange={(e) => {
                setSetting({
                  targetLanguage: e.target.value as LangCode,
                });
              }}
              className="select select-bordered w-full"
          >
            {AllLanguage.map((item) => (
                <option key={item.language} value={item.language}>
                  {item.name}
                </option>
            ))}
          </select>
        </label>
      </div>
      <Login/>
    </div>
  );
}
