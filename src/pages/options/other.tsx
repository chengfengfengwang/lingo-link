import { clearSetting } from "@/storage/sync";
import { clearLocal } from "@/storage/local";
import { clearSession } from "@/storage/session";
import browser from "webextension-polyfill";
import { useTranslation } from "react-i18next";

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
      <div>
        <h1 className="my-3 text-lg font-semibold">
          {t("Video Website Support List")}
        </h1>
        <ul>
          <li>
            <a
              className="underline"
              target="_blank"
              href="https://mw.lonelil.ru"
            >
              https://mw.lonelil.ru
            </a>
          </li>
          <li>
            <a
              className="underline"
              target="_blank"
              href="https://movie-web-me.vercel.app"
            >
              https://movie-web-me.vercel.app
            </a>
          </li>
          <li className="mt-1 opacity-60">more websites updating...</li>
        </ul>
      </div>
      <div className="text-green-700">
        <h1>{t("Sorry")}😅</h1>
        <h1>{t("Feedback")}</h1>
      </div>
    </div>
  );
}
