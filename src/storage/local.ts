import type { CommunityItemType, Sww } from "@/types/words";
import { Local } from "@/types";
import { isSameWord } from "@/utils";
import browser from "webextension-polyfill";
export const getLocal = async(): Promise<Local>=>{
  return await browser.storage.local.get();
}
export const setLocal = async(param: Partial<Local>)=>{
  return browser.storage.local.set(param);
}
export const clearLocal = async()=>{
  return browser.storage.local.clear();
}
export const addWord = async (sww: Sww) => {
  const swwList = (await getLocal())?.swwList ?? [];
  setLocal({swwList: [...swwList, sww]})
};
export const updateWord = async(sww: Sww) => {  
  const swwList = (await getLocal())?.swwList ?? [];
  setLocal({swwList:(
    swwList.map((item) => {
      if (isSameWord(item.word, sww.word)) {
        return { ...item, ...sww  };
      } else {
        return item;
      }
    })
  )});
};
export const removeWord = async({ word }: { word: string; }) => {  
  const swwList = (await getLocal())?.swwList ?? [];

  setLocal({swwList: (swwList.filter((item) => !isSameWord(item.word, word)))});
};

export const getList = async () => {
  return (await getLocal()).swwList ?? []
}
export const getRemarkList = async () => {
  return (await getLocal()).remarkList ?? []
}
export const addRemark = async (item: CommunityItemType) => {
  const remarkList = (await getLocal())?.remarkList ?? [];
  setLocal({remarkList: [...remarkList, item]})
};
export const updateRemark = async(item: CommunityItemType) => {  
  const remarkList = (await getLocal())?.remarkList ?? [];
  setLocal({remarkList:(
    remarkList.map((im) => {
      if (item.id === im.id) {
        return { ...im, ...item  };
      } else {
        return im;
      }
    })
  )});
};
export const removeRemark = async({ id }: { id: string; }) => {  
  const remarkList = (await getLocal())?.remarkList ?? [];

  setLocal({remarkList: (remarkList.filter((item) => item.id !== id))});
};