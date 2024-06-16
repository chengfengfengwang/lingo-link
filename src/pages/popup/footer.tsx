import { setSession } from "@/storage/session";
import { getSetting } from "@/storage/sync";
import { Setting } from "@/types";
import { Settings, ClipboardList, Scissors, RefreshCcw } from "lucide-react";
import { wordListUrl, wordListWindowName } from "@/utils/const";
import { screenshot } from "@/utils";
import browser from "webextension-polyfill";
import Avator from "@/components/Avator";
import { getSwwList } from "@/api";
import { setLocal } from "@/storage/local";
import { useState } from "react";

export default function PopupFooter({ user }: { user: Setting["userInfo"] }) {
  const [refetchLoading,setRefetchLoading] = useState(false);
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
  const captureScreen = async () => {
    screenshot();
    setTimeout(() => {
      window.close();
    }, 100);
  };
  const refechWordList = async ()=> {
    setRefetchLoading(true);
    setTimeout(() => {
      setRefetchLoading(false)
    }, 2000);
    return
    getSwwList().then((res) => {
      if (res?.list instanceof Array) {
        setLocal({swwList: res.list})
      }
    }).finally(()=>{
      setRefetchLoading(false)
    })
  }
  return (
    <div className="flex items-center justify-between bg-base-200/80 px-3 py-1 text-[11px]">
      <div onClick={openOption} className="flex items-center cursor-pointer">
        {user && <Avator uri={user.picture} name={user.name ?? user.email} />}
        <span className="pl-1 text-base-content/80">
          {user?.name ?? user?.email}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <RefreshCcw
          onClick={refechWordList}
          className="opacity-50 cursor-pointer animate-spin"
          width={16}
          hanging={16}
        />
        <Scissors
          onClick={captureScreen}
          className="opacity-50 cursor-pointer"
          width={16}
          hanging={16}
        />
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
