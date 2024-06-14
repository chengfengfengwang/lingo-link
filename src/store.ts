import { Setting } from "@/types";
import { atom } from "jotai";
import { Sww } from "./types/words";
import { getSetting as getSettingStorage, setSetting as  setSettingStorage} from "./storage/sync";
import { addSwwApi, removeWordApi, updateWordApi } from "./api";
import { removeWord as removeStorageWord, updateWord as updateStorageWord, addWord as addStorageWord } from "@/storage/local";
import { addWordOulu, removeWordOulu } from "./api/oulu";
import { getList as getStorageSwwList } from "@/storage/local";
const _settingAtom = atom<Setting|Record<string,never>>({})
export const swwListAtom = atom<Sww[]>([])
swwListAtom.onMount = (setAtom) => {
  getStorageSwwList().then(res => {
    setAtom(res)
  })
}
export const settingAtom = atom((get)=>{
  return get(_settingAtom)
},(get,set,update:Partial<Setting>) => {
  const setting = get(
    _settingAtom);
  set(_settingAtom, {...setting, ...update});
  setSettingStorage(update)
})
settingAtom.onMount = (setAtom)=>{
  getSettingStorage().then((res) => {
    setAtom(res)
  })
}
export const addSwwAtom = atom(null,(get,set,sww:Sww) => {
  addSwwApi(sww);
  addStorageWord(sww)
  addWordOulu(sww.word)
  set(swwListAtom, [...get(swwListAtom), sww])
})
export const removeSwwAtom = atom(null,(get,set,sww:Sww) => {
  removeWordApi(sww.id);
  removeStorageWord({word: sww.word});
  removeWordOulu(sww.word)
  set(swwListAtom, get(swwListAtom).filter(item => item.id !== sww.id))
})
export const updateSwwItemAtom = atom(null,(get,set,update:Sww) => {
  set(swwListAtom, get(swwListAtom).map(item => {
    if (item.id === update.id) {
      updateWordApi({id:update.id,masteryLevel:update.masteryLevel,word:update.word,context:update.context});
      updateStorageWord(update)
      return update
    } else {
      return item
    }
  }))
})