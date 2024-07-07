import { toastManager } from "@/components/Toast";
import type { CommunityItemType, Sww } from "@/types/words";
import { getSetting } from "@/storage/sync";
import { base64ToBlob, sendBackgroundFetch } from "@/utils";
import { User } from "@/types";

const baseUrl = "https://api.mywords.cc";
interface Login {
  params:
    | { email: string; code: number; loginWithGoogle: boolean }
    | { email: string; password: string; loginWithGoogle: boolean }
    | {
        loginWithGoogle: boolean;
        email: string;
        picture: string;
        name: string;
      };
  res: User;
}

const request = async (
  url: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
  }
) => {
  const setting = await getSetting();
  options.method = options.method ?? 'GET'
  if (!url.endsWith("upload")) {
    options.headers = {
      "Content-Type": "application/json",
    };

    if (options.body) {      
      options.body = JSON.stringify(options.body);
    }
  } else {
    options.headers = {};
  }

  if (setting?.userInfo?.token) {
    options.headers.token = setting.userInfo.token;
  }
  
  const res = await fetch(`${baseUrl}${url}`, options);
  const json = await res.json();
  if (json.error) {
    toastManager.add({ msg: json.error, type: "error" });
    throw json.error;
  }
  return json;
};

export const addSwwApi = async (param: Sww) => {
  return request("/word/add", {
    method: "POST",
    body: param,
  });
};
export const updateWordApi = async (
  param: Pick<Sww, "id"> & Partial<Omit<Sww, "id">>
) => {
  return request("/word/update", {
    method: "POST",
    body: param,
  });
};
export const getSwwList = async (): Promise<{ list: Sww[] } | undefined> => {
  return request("/word/list", {
    method: "GET",
  });
};
export const removeWordApi = async (word: string) => {
  return request(`/word/delete/${encodeURIComponent(word)}`, {
    method: "DELETE",
  });
};
export const upload = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('file', blob)
  return request(`/word/upload`, {
    method: "POST",
    body: formData,
  });
};
export const login = async (params: Login["params"]): Promise<Login["res"]> => {
  return request("/login", {
    method: "POST",
    body: params,
  });
};
export async function baiduDetectLang(text: string) {
  const urlSearchParam = new URLSearchParams({query: text});
  const json = await sendBackgroundFetch({
    url: `https://fanyi.baidu.com/langdetect?${urlSearchParam}`,
    method: 'POST',
    responseType: "json",
  });
  
    // return langMap[json.lan] || "en";
    return json.lan ?? 'en'
}
export async function uploadMultiBase64(arr: string[]) {  
  const urls:string[] = await Promise.all(
    arr.map(async (base64) => {
      if (base64.startsWith("http")) {
        return base64;
      } else {
        const blob = await base64ToBlob(base64);
        const key = (await upload(blob)).key;
        return "https://r2.mywords.cc/" + key
      }
    }),
  );
  return urls;
}
export const getMyAllRemarkList = async (): Promise<{ list: CommunityItemType[] } | undefined> => {
  return request(`/community/allRemarkList`, {
    method: "GET",
  });
};
export const addCommunity = async (param: CommunityItemType) => {
  return request("/community/add", {
    method: "POST",
    body: param,
  });
};
export const deleteCommunity = async (param:{id: string}) => {
  return request("/community/delete", {
    method: "POST",
    body: param,
  });
};
export const editItemContent = async (param: {id:string,content:string,imgs:string[], lastEditDate:number}) => {
  return request("/community/itemEditContent", {
    method: "POST",
    body: param,
  });
};