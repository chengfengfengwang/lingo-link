import { clearSetting } from "@/storage/sync";
import { clearLocal } from "@/storage/local";
import { clearSession } from "@/storage/session";
import browser from "webextension-polyfill";
import { useTranslation } from "react-i18next";
import {Github} from 'lucide-react'
export default function Other() {
  const { t } = useTranslation();
  const reset = async () => {
    await clearLocal();
    await clearSetting();
    await clearSession();
    browser.runtime.reload();
  };
  return (
    <div className="space-y-[50px]">
      <div>
        <div className="dropdown">
          <button tabIndex={0} role="button" className="btn btn-neutral btn-sm">
            {t("Clear All Settings")}
          </button>
          <div
            tabIndex={0}
            className="dropdown-content card card-compact w-[170px] bg-base-200 text-base-content text-xs"
          >
            <div className="card-body items-center text-center">
              <p className="text-[13px]">{t("Confirm Question")}</p>
              <div className="card-actions justify-end">
                <button
                  onMouseDown={() =>
                    (document.activeElement as HTMLElement).blur()
                  }
                  className="btn btn-xs btn-primary"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={() => {
                    (document.activeElement as HTMLElement).blur();
                    reset();
                  }}
                  className="btn btn-xs btn-ghost"
                >
                  {t("Confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-green-700">
        <h1>{t("Sorry")}😅</h1>
        <h1>{t("Feedback")}</h1>
      </div>
      <div>
        <a
          target="feedback"
          className="underline link flex items-center"
          href="https://github.com/chengfengfengwang/lingo-link"
        >
          <Github width={22} height={22} className="mr-1" /> 建议、反馈、贡献
        </a>
      </div>
    </div>
  );
}
