import Browser from "webextension-polyfill";
export type SessionStorageInterface = {
  showLogin?: boolean,
} 
export const getSession = async(): Promise<SessionStorageInterface>=>{
  return await Browser.storage.session.get();
}
export const setSession = async(param: Partial<SessionStorageInterface>)=>{  
  return await Browser.storage.session.set(param);
}

export const clearSession = async()=>{  
  return await Browser.storage.session.clear();
}

