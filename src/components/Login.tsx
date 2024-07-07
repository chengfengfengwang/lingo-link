import { getMyAllRemarkList, getSwwList, login } from "@/api";
import googleIcon from "@/assets/google.png";
import React, { useEffect, useRef, useState } from "react";
import { toastManager } from "@/components/Toast";
import { GoogleLoginError, GoogleUser } from "@/types";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import browser from "webextension-polyfill";
import { useAtom } from "jotai";
import { settingAtom, remarkListAtom, swwListAtom } from "@/store";
import { setLocal} from "@/storage/local";
const imgUrl = new URL(googleIcon, import.meta.url).href;
const hideGoogleLogin = /Firefox|Edg/.test(navigator.userAgent);
const resendTime = 10;
let dialogEle:HTMLDialogElement|null=null;
export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const [,setSetting] = useAtom(settingAtom);
  const [loadingShow, setLoadingShow] = useState(false);
  const [countdownStatus, setCountdownStatus] = useState(false);
  const [countdown, setCountdown] = useState(resendTime);
  const dialogRef = useRef<HTMLDialogElement|null>(null)
  const [,setRemarkList] = useAtom(remarkListAtom);
  const [,setSwwList] = useAtom(swwListAtom)
  const storeResult = (loginRes: Awaited<ReturnType<typeof login>>) => {
    setSetting({
      userInfo: {
        email: loginRes.email,
        id: loginRes.id,
        picture: loginRes.picture,
        name: loginRes.name,
        token: loginRes.token,
      },
    });
    getSwwList().then(res => {
      if (res?.list instanceof Array) {
        setLocal({swwList: res.list});
        setSwwList(res.list)
      }
    })
    getMyAllRemarkList().then(res => {
      if (res?.list instanceof Array) {
        setLocal({remarkList: res.list});
        setRemarkList(res.list)
      }
    })
    toastManager.add({ type: "success", msg: "登录成功" });
  };
  useEffect(() => {
    let timer: number | null = null;
    if (countdownStatus) {
      timer = window.setInterval(() => {
        setCountdown((pre) => pre - 1);
      }, 1000);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [countdownStatus]);
  useEffect(() => {
    if (countdown < 1) {
      setCountdownStatus(false);
    }
  }, [countdown]);
  useEffect(()=>{
   dialogEle= dialogRef.current
  },[])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = (
        (e.target as HTMLFormElement).elements[0] as HTMLInputElement
      ).value.trim();
      // const code = (
      //   (e.target as HTMLFormElement).elements[1] as HTMLInputElement
      // ).value.trim();
      const password = (
        (e.target as HTMLFormElement).elements[1] as HTMLInputElement
      ).value.trim();
      if (!email) {
        toastManager.add({ type: "error", msg: 'email is empty' });
        return
      }
      if (!password) {
        toastManager.add({ type: "error", msg: 'password is empty' });
        return
      }
      const loginRes = await login({
        email,
        password,
        loginWithGoogle: false,
      });
      storeResult(loginRes);
    } catch (error) {
      console.log(error);
    } finally {
      dialogRef.current?.close();
      setLoadingShow(false);
    }
  };
  const googleLogin = async () => {
    try {
      setLoadingShow(true);
      const res: GoogleUser | GoogleLoginError =
        await browser.runtime.sendMessage({ type: "auth" });
      if ("error" in res) {
        toastManager.add({ type: "error", msg: res.error_description });
        return;
      } else {
        const loginRes = await login({ ...res, ...{ loginWithGoogle: true } });
        storeResult(loginRes);
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dialogRef.current?.close();
      setLoadingShow(false);
    }
  };
  return (
    <dialog id="login_modal" ref={dialogRef} className="modal z-[2147483647]">
      <div className="relative modal-box max-w-[430px]">
        {loadingShow && (
          <div className="z-10 absolute inset-0 bg-black/20  flex items-center justify-center">
            <span className="loading loading-spinner loading-md text-neutral"></span>
          </div>
        )}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-[5px] top-[5px] outline-none">
            ✕
          </button>
        </form>
        <div className="space-y-3 p-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="block">
                <input
                  id="email"
                  placeholder={t("Email")}
                  type="email"
                  required
                  autoComplete="username"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="block">
                <input
                  id="password"
                  placeholder={t("Password")}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="input input-bordered w-full"
                />
              </label>
             
              <button type="submit" className="btn btn-block">
                {t("Sign in")}
              </button>
              <div className="flex items-center justify-center opacity-50 text-xs space-x-1">
                <Info className="w-[12px] h-[12px]" />
                <span>{t('Login Tip')}</span>
              </div>
            </div>
          </form>
          {!hideGoogleLogin && (
            <>
              <div className="divider !my-[30px]">OR</div>
              <div onClick={googleLogin} className="btn  btn-block">
                <div>
                  <img width={30} src={imgUrl} alt="" />
                </div>
                <div className="leading-tight text-sm font-semibold opacity-80 text-base-content">
                  <div>{t("Sign in with Google")}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
export const showLogin = () => {  
  dialogEle?.showModal();
};
