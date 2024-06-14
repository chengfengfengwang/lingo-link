export default function DialogWrapper({children,id}:{children:React.ReactElement,id?:string}) {
  return  (
    <dialog id={`${id ? id : 'dialog_wrapper'}`} className="modal z-[2147483647]">
      <div className="relative modal-box max-w-[600px]">
        {/* {loadingShow && (
          <div className="z-10 absolute inset-0 bg-black/20  flex items-center justify-center">
            <span className="loading loading-spinner loading-md text-neutral"></span>
          </div>
        )} */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-[5px] top-[5px] outline-none">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
}
export const showDialog = (id?:string) => {  
  (document.querySelector(`#${typeof id === 'string' ? id : 'dialog_wrapper'}`) as HTMLDialogElement)?.showModal();
};
export const hideDialog = (id?:string) => {  
  (document.querySelector(`#${typeof id === 'string' ? id : 'dialog_wrapper'}`) as HTMLDialogElement)?.close();
};