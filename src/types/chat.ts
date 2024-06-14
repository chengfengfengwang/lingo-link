export interface Message {
  role: 'user' | 'assistant' | 'system',
  content: string,
  isError?: boolean
}
export interface OpenAIRecordItem {
  conversationId: string,
  messageList: Message[],
  lastMessageId?: string
}
export interface  Chat {
  messageList: Message[]
  sendMessage: (content?:string)=>void
  abort: ()=>void
  clearMessage: ()=>void
  refresh: ()=>void
  resume?: (params: OpenAIRecordItem) => void
}