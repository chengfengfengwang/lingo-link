import Browser from "webextension-polyfill";
import type { ExtensionMessage, BackgroundFetchParam } from "./types";
//const  screenshot = async () => {
//   const res = await Browser.tabs.captureVisibleTab();
//   const tabs = await Browser.tabs.query({
//     active: true,
//     currentWindow: true
//   })
//   const message: ExtensionMessage = {
//     type: 'onScreenDataurl',
//     payload: res
//   }
//   Browser.tabs.sendMessage(tabs[0].id!, message);
// }

const backgroundFetch = async (param: BackgroundFetchParam) => {
  const { url, method, responseType } = param;
  const options: Record<string, unknown> = {
    method: method ?? "GET",
  };
  if (param.body) {
    options.body = param.body;
  }
  if (param.headers) {
    options.headers = param.headers;
  }
  return fetch(url, options).then(async (res) => {
    //console.log(res);
    if (!res.ok) {
      return {
        error: "fetch failed",
      };
    }
    if (responseType === "dataURL") {
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          resolve(this.result);
        };
        reader.readAsDataURL(blob);
      });
    } else if (responseType === "text") {
      return await res.text();
    } else if (responseType === "json") {
      return await res.json();
    }
  });
};
Browser.runtime.onInstalled.addListener(() => {
  Browser.contextMenus.create({
    id: "translate",
    title: "translate",
    contexts: ["selection"],
    documentUrlPatterns: [
      "http://*/*",
      "https://*/*",
      "file://*/*",
      "ftp://*/*",
    ],
  });
});
Browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate") {
    if (!tab?.id) {
      return;
    }
    const message:ExtensionMessage = {
      type: 'showCardAndPosition'
    }
    Browser.tabs.sendMessage(tab?.id, message);
  }
});
Browser.runtime.onMessage.addListener(async (message: ExtensionMessage) => {  
  if (message.type === "fetch") {
    const res = await backgroundFetch(message.payload);
    return res;
  }
  if (message.type === "openOptions") {
    return await Browser.runtime.openOptionsPage();
  }
  if (message.type === "auth") {
    if (chrome && chrome.identity && chrome.identity.getAuthToken) {
      const tokenInfo = await chrome.identity.getAuthToken({
        interactive: true,
      });
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${tokenInfo.token}`
      );
      return await res.json();
    }
  }
  if (message.type === 'captureScreen') {
    return await Browser.tabs.captureVisibleTab()
  }
});

