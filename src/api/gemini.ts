import type { Chat, Message } from "@/types/chat";
import { ChatConstructor } from "./openAI";
import { getSetting } from "@/storage/sync";
import { toastManager } from "@/components/Toast";

function tryParse(currentText: string): {
  remainingText: string;
  parsedResponse: any;
} {
  let jsonText: string;
  if (currentText.startsWith("[")) {
    if (currentText.endsWith("]")) {
      jsonText = currentText;
    } else {
      jsonText = currentText + "]";
    }
  } else if (currentText.startsWith(",")) {
    if (currentText.endsWith("]")) {
      jsonText = "[" + currentText.slice(1);
    } else {
      jsonText = "[" + currentText.slice(1) + "]";
    }
  } else {
    return {
      remainingText: currentText,
      parsedResponse: null,
    };
  }

  try {
    const parsedResponse = JSON.parse(jsonText);
    return {
      remainingText: "",
      parsedResponse,
    };
  } catch (e) {
    throw new Error(`Invalid JSON: "${jsonText}"`);
  }
}
export default class GeminiClass implements Chat {
  controller: AbortController;
  messageList: Message[];
  onError?: (err: string) => void;
  onBeforeRequest?: () => void;
  onGenerating?: (text: string) => void;
  onComplete: (text: string) => void;
  onClear?: () => void;
  systemPrompt?: string;
  constructor({
    onError,
    onGenerating,
    onBeforeRequest,
    onComplete,
    onClear,
    preMessageList,
  }: ChatConstructor) {
    this.controller = new AbortController();
    this.messageList = preMessageList ? preMessageList : [];
    this.onBeforeRequest = onBeforeRequest;
    this.onError = onError;
    this.onGenerating = onGenerating;
    this.onComplete = onComplete;
    this.onClear = onClear;
  }
  async sendMessage(content?: string) {
    if (this.controller.signal.aborted) {
      this.controller = new AbortController();
    }
    const key = (await getSetting()).geminiKey;
    if (!key) {
      toastManager.add({
        type: 'error',
        msg: 'geminiKey is empty'
      })
      return
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${key}`;
    // const apiKey = setting.openAIKey
    // if (!apiKey) {
    //   this.onError && this.onError('apiKey is empty')
    //   return
    // }
    try {
      content && this.messageList.push({role: 'user', content});
      this.messageList.push({role: 'assistant', content: ''})
      const bodyMessage = this.messageList.slice(0, -1).map((item) => {
        if (item.role === "assistant") {
          return {
            role: "model",
            parts: [{ text: item.content }],
          };
        } else {
          return {
            role: "user",
            parts: [{ text: item.content }],
          };
        }
      });
      this.onBeforeRequest && await this.onBeforeRequest();
      const res = await fetch(url, {
        method: "POST",
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: bodyMessage,
        }),
      });
      if (!res.ok || !res.body) {
        const json = await res.json();
        if (json[0].error) {
          const message = json[0].error.message || json[0].error;
          //toastManager.add({ type: 'error', msg: message});
          this.onError && this.onError(message);
          return;
        }
        this.onError && this.onError(json.error);
        return;
      }
      const reader = res.body.getReader();
      let result = "";
      let currentText = "";
      let stop = false;
      const jsonParser = async ({
        value,
      }: {
        value: string;
        done: boolean;
      }) => {
        currentText += value;
        const { parsedResponse, remainingText } = tryParse(currentText);

        if (parsedResponse) {
          currentText = remainingText;
          for (const item of parsedResponse) {
            const text = item.candidates[0].content.parts[0].text;
            result += text;
            this.messageList = this.messageList.map((message, index) => {
              if (index === this.messageList.length - 1) {
                return { ...message, ...{ content: result } };
              } else {
                return message;
              }
            });
            if (value.endsWith("]")) {
              stop = true;
            }
            this.onGenerating && this.onGenerating(result);
          }
        }
        if (parsedResponse === null || stop) {
          this.onComplete && this.onComplete(result);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const text = new TextDecoder().decode(value);
        jsonParser({ value: text, done });
      }
    } catch (error) {
      this.onError && this.onError("request failed");
    }
  }
  clearMessage() {
    this.controller.abort("card is hidden");
    this.messageList = [];
    this.onClear && this.onClear();
  }
  refresh() {
    this.messageList = this.messageList.slice(0, -1);
    this.sendMessage()
  }
  abort() {
    this.controller.abort("card is hidden");
  }
}
