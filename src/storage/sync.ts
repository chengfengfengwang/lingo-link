import { Setting } from "@/types";
import Browser from "webextension-polyfill";
export const getSetting = async(): Promise<Setting>=>{
  return await Browser.storage.sync.get();
}
export const setSetting = async(param: Partial<Setting>)=>{
  return Browser.storage.sync.set(param);
}
export const clearSetting = async()=>{
  return Browser.storage.sync.clear();
}