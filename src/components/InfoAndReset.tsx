import { useTranslation } from "react-i18next";
import { Info,RotateCw } from "lucide-react";
export default function InfoAndReset({
  tip,
  onReset
}: {
  tip:string
  onReset: () => void;
}) {
  const { t } = useTranslation();
  const closeConfirm = ()=>{
    (document.activeElement as HTMLElement).blur()
  }
  return (
    <>
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-circle btn-ghost btn-xs text-info outline-none"
        >
          <Info className="w-[14px] h-[14px]" />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content z-[1]  bg-base-200 rounded-md w-[320px]"
        >
          <div tabIndex={0} className="p-2 text-sm">
            <p>{tip}</p>
          </div>
        </div>
      </div>
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-circle btn-ghost btn-xs text-info outline-none"
        >
          <RotateCw className="w-[14px] h-[14px]" />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content card card-compact w-[170px] bg-base-200 text-base-content text-xs"
        >
          <div className="card-body items-center text-center">
            <p className="text-[13px]">{t('Confirm Question')}</p>
            <div className="card-actions justify-end">
              <button onMouseDown={closeConfirm} className="btn btn-xs btn-primary">{t('Cancel')}</button>
              <button onClick={()=>{closeConfirm();onReset()}} className="btn btn-xs btn-ghost">{t('Confirm')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}