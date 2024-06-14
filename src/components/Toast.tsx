import { useEffect, useState } from "react";
interface ToastConfig {
  type: "success" | "error" | "info";
  msg: string;
  id?: string;
}
type AddToast = (config: ToastConfig) => void;
type RemoveToast = (id: string) => void;
interface ToastManager {
  init: ({ add, remove }: { add: AddToast; remove: RemoveToast }) => void;
  add: AddToast;
  remove: RemoveToast | undefined;
}
const retain = 5000;
function Toaster({ msg, type }: { msg: string; type: ToastConfig["type"] }) {
  let alertType = '';
  switch (type) {
    case 'success':
      alertType = 'alert-success'
      break;
    case 'error':
      alertType = 'alert-error'
      break;
    default:
      break;
  } 
  return (
    <div role="alert" className={`alert gap-[10px] ${alertType}`}>
      {type === "info" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      )}
      {
        type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
      }
      {
        type === 'error' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )
      }
      <span>{msg}</span>
    </div>
  );
}
export const toastManager: ToastManager = {
  init(param) {
    toastManager.add = param.add;
    toastManager.remove = param.remove;
  },
  // @ts-ignore
  add: (config) => {
    throw new Error("not init");
  },
  // @ts-ignore
  remove: (id) => {
    throw new Error("not init");
  },
};
export const ToastContainer = function () {
  const [toastList, setToastList] = useState<ToastConfig[]>([]);
  const addToast = (config: ToastConfig) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToastList((prev) => [...prev, { ...config, id }]);
    setTimeout(() => {
      removeToast(id);
    }, retain);
  };
  const removeToast = (id: string) => {
    setToastList((list) => list.filter((item) => item.id !== id));
  };
  useEffect(() => {
    toastManager.init({
      add: addToast,
      remove: removeToast,
    });
  }, [addToast, removeToast]);
  return (
    <div
      className={`text-[16px] toast toast-center toast-top z-[2147483647] ${
        toastList.length ? "" : "hidden"
      }`}
    >
      {toastList.map((item) => (
        <Toaster key={item.id} type={item.type} msg={item.msg} />
      ))}
    </div>
  );
};
