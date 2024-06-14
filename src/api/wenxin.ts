import { toastManager } from '@/components/Toast'
import type { Chat, Message } from '@/types/chat'
import { ChatConstructor } from './openAI'
import { handleStream } from '@/utils'
import { formateMessage } from "@/utils";
import { getSetting } from '@/storage/sync';
export interface WenxinConstructor extends ChatConstructor{
  
}
export default class WenxinClass implements Chat {
  controller: AbortController
  messageList: Message[]
  onError?: (err: string) => void
  onBeforeRequest?: () => void
  onGenerating?: (text: string) => void
  onComplete: (text: string) => void
  onClear?: () => void
  constructor({
    onError,
    onGenerating,
    onBeforeRequest,
    onComplete,
    onClear,
    preMessageList
  }: WenxinConstructor) {
    this.controller = new AbortController()
    this.messageList = preMessageList ? preMessageList : []
    this.onBeforeRequest = onBeforeRequest
    this.onError = onError
    this.onGenerating = onGenerating
    this.onComplete = onComplete
    this.onClear = onClear
  }
  async sendMessage(content?: string) {
    if (this.controller.signal.aborted) {
      this.controller = new AbortController()
    }
    const token = (await getSetting()).wenxinToken;
    if (!token) {
      toastManager.add({
        type: 'error',
        msg: 'token is empty'
      })
      return
    }
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_8k?access_token=${token}`
  //   //const model = setting.openAIModel?? defaultSetting.openAIModel
  //  // const apiKey = setting.openAIKey
  //   if (!apiKey) {
  //     //toastManager.add({ type: 'error', msg: 'apiKey is empty' })
  //     this.onError && this.onError('apiKey is empty')
  //     return
  //   }
    try {
      content && this.messageList.push({role: 'user', content});
      this.messageList.push({role: 'assistant', content: ''})
      this.messageList = await formateMessage('wenxin',this.messageList);
      this.onBeforeRequest && await this.onBeforeRequest()
      const res = await fetch(url, {
        method: 'POST',
        signal: this.controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.messageList.slice(0, -1),
          stream: true,
        }),
      })
      if (!res.ok || !res.body) {
        const json = await res.json()
        if (json.error.message) {
          toastManager.add({ type: 'error', msg: json.error.message })
        }
        this.onError && this.onError(json.error)
        return
      }
      const reader = res.body.getReader();
      let result = '';
      handleStream(reader, (data)=> {
        const json = JSON.parse(data)            
        if (json.error) {
          toastManager.add({ type: 'error', msg: json.error.message })
          this.onError && this.onError(json.error)
          return
        }            
        const text = json.result || '';
        result += text;
        this.messageList = this.messageList.map((message, index) => {
          if (index === this.messageList.length - 1) {
            return {...message, ...{content: message.content + text}}
          } else {
            return message
          }
        })
        this.onGenerating && this.onGenerating(result)

        if (json.is_end) {
          this.onComplete(this.messageList[this.messageList.length-1].content)
        } 
      })
    } catch (error) {
      this.onError && this.onError('request failed')
    }
  }
  refresh() {
    this.messageList = this.messageList.slice(0, -1);
    this.sendMessage()
  }
  clearMessage() {
    this.controller.abort()
    this.messageList = []
    this.onClear && this.onClear()
  }
  abort(){
    this.controller.abort()
  };
}