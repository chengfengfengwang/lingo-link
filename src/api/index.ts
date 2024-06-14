import { toastManager } from "@/components/Toast";
import type { Sww } from "@/types/words";
import { getSetting } from "@/storage/sync";
import { sendBackgroundFetch } from "@/utils";
import { User } from "@/types";
import type { BackgroundFetchParam } from "@/types";
// const baseUrl = 'https://dsg1ijpmsi.hk.aircode.run'
//const baseUrl = 'http://localhost:8787'
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
  return request(`/word/delete/${word}`, {
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
export const sendEmail = async (params: { email: string }) => {
  return request("/sendSms", {
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
