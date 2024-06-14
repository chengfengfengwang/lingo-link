import { useEffect } from "react";
import type { PostMessage } from "@/types";
export default function useListenPostMessage(callback:(data:PostMessage,source?:MessageEventSource | null)=>void) {
  useEffect(()=>{
    const handleMessage = (e:MessageEvent<PostMessage>) => {
      const data = e.data;            
      callback(data, e.source)
    };
    window.addEventListener('message', handleMessage);
    return ()=>{
      window.removeEventListener('message', handleMessage);
    }
  }, [callback])
}