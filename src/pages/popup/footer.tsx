import { setSession } from "@/storage/session";
import { getSetting } from "@/storage/sync";
import { Setting } from "@/types";
import { Settings, ClipboardList, Check, RefreshCcw } from "lucide-react";
import { wordListUrl, wordListWindowName } from "@/utils/const";
//import { screenshot } from "@/utils";
import browser from "webextension-polyfill";
import Avator from "@/components/Avator";
import { getSwwList } from "@/api";
import { setLocal } from "@/storage/local";
import { useState } from "react";
let timer: number | null = null;
export default function PopupFooter({ user }: { user: Setting["userInfo"] }) {
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const openOption = async () => {
    browser.runtime.openOptionsPage();
  };
  const openWordList = async () => {
    const setting = await getSetting();
    if (!setting.userInfo?.email) {
      await setSession({ showLogin: true });
      openOption();
    } else {
      window.open(wordListUrl, wordListWindowName);
    }
  };
  // const captureScreen = async () => {
  //   screenshot();
  //   setTimeout(() => {
  //     window.close();
  //   }, 100);
  // };
  const refechWordList = async () => {
    setRefetchLoading(true);
    getSwwList()
      .then((res) => {
        if (res?.list instanceof Array) {
          setLocal({ swwList: res.list });
          setShowSuccess(true);
        }
        timer = window.setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
      })
      .finally(() => {
        setRefetchLoading(false);
      });
    return () => {
      timer && clearTimeout(timer);
    };
  };
  return (
    <div className="flex items-center justify-between bg-base-200/80 px-3 py-1 text-[11px]">
      <div onClick={openOption} className="flex items-center cursor-pointer">
        {user && <Avator uri={user.picture} name={user.name ?? user.email} />}
        <span className="pl-1 text-base-content/80">
          {user?.name ?? user?.email}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        {showSuccess ? (
          <Check className="opacity-50" width={16} hanging={16} />
        ) : null}
        {!showSuccess ? (
          <span data-tip="从远程更新单词列表" className={`tooltip tooltip-left`}>
            <RefreshCcw
              onClick={refechWordList}
              className={`opacity-50 cursor-pointer ${
                refetchLoading ? "animate-spin" : null
              } `}
              width={16}
              hanging={16}
            />
          </span>
        ) : null}

        {/* <Scissors
          onClick={captureScreen}
          className="opacity-50 cursor-pointer"
          width={16}
          hanging={16}
        /> */}
        <ClipboardList
          onClick={openWordList}
          className="opacity-50 cursor-pointer"
          width={16}
          hanging={16}
        />
        <Settings
          onClick={openOption}
          className="opacity-50 cursor-pointer"
          width={16}
          hanging={16}
        />
      </div>
    </div>
  );
}
