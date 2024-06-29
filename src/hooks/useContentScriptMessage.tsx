import { ExtensionMessage } from "@/types";
import { useEffect } from "react";
import { getList as getStorageSwwList, getRemarkList } from "@/storage/local";
import { useAtom } from "jotai";
import { remarkListAtom, swwListAtom } from "@/store";
import Browser from "webextension-polyfill";
import { isInPopup } from "@/utils";


export default function useContentScriptMessage() {
  const [,setRemarkList] = useAtom(remarkListAtom);
  const [,setSwwList] = useAtom(swwListAtom)
  useEffect(()=>{    
    const handler = (message:ExtensionMessage) => {      
      if (message.type === 'refreshLocalData' && !isInPopup) {
        getRemarkList().then(res => {
          setRemarkList(res)
        })
        getStorageSwwList().then(res => {
          setSwwList(res)
        })
      }
    }
    Browser.runtime.onMessage.addListener(handler)
    return () => {
      Browser.runtime.onMessage.removeListener(handler)
    }
  }, [setRemarkList,setSwwList])
}