import { useState, useRef, useEffect } from "react";
import {
  Volume2 as SpeakerLoudIcon,
  Volume1 as SpeakerModerateIcon,
  Volume as SpeakerQuietIcon,
} from "lucide-react";
import { sendBackgroundFetch } from "@/utils";
import {pageClicked} from '@/utils/pageClicked'
import { isInPopup } from "@/utils";
import '@/assets/styles/sperkerMotion.css'

class YoudaoAudio {
  onplay: () => void;
  onended: () => void;
  text: string;
  type: string;
  lang: string;
  context: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  close: ()=>void
  constructor({
    text,
    type,
    lang,
    onplay,
    onended,
    autoPlay,
  }: {
    text: string;
    type: string;
    lang:string;
    onplay: () => void;
    onended: () => void;
    autoPlay: boolean;
  }) {
    this.onplay = onplay;
    this.onended = onended;
    this.lang = lang;
    this.type = type;
    this.text = text;
    this.audioBuffer = null;
    this.close = ()=> this.context?.close()
    if (autoPlay && pageClicked && !isInPopup) {
      this.context = new AudioContext();
      this.play();
    } else {
      this.context = null;
    }
  }
  async fetch() {
    const base64String = await sendBackgroundFetch({
      url:  `https://dict.youdao.com/dictvoice?audio=${this.text}&le=${this.lang}&type=${this.type}`,
      responseType: "dataURL",
    });
    const base64Data = base64String.split(",")[1] || base64String;
    // 将base64字符串转换为ArrayBuffer
    const audioData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }
    const data = await this.context?.decodeAudioData(arrayBuffer);
    this.audioBuffer = data ?? null;
  }
  async play() {
    if (!this.context) {
      this.context = new AudioContext();
    }
    if (!this.audioBuffer) {
      await this.fetch();
    }
    const audioBufferSourceNode = new AudioBufferSourceNode(this.context);
    audioBufferSourceNode.buffer = this.audioBuffer;
    audioBufferSourceNode.connect(this.context.destination);
    this.onplay();
    audioBufferSourceNode.start();
    audioBufferSourceNode.onended = this.onended;
  }
}
const width = 16;
const height = 16;
export default function YoudaoSpeaker({
  text,
  autoPlay,
  lang,
  type = "2", //en lang=1 uk; lang=2 us
  className
}: {
  text: string;
  lang:string,
  autoPlay: boolean;
  type?: string;
  className?:string
}) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const youdaoAudioInstance = useRef<YoudaoAudio | null>(null);
  const handlePlay = () => {
    youdaoAudioInstance.current?.play();
  };  
  useEffect(() => {
    //if (youdaoAudioInstance.current){return}
    youdaoAudioInstance.current = new YoudaoAudio({
      text,
      lang,
      type,
      onplay: () => {
        setIsAudioPlaying(true);
      },
      onended: () => {
        setIsAudioPlaying(false);
      },
      autoPlay,
    });
    return () => {
      youdaoAudioInstance.current?.close()
    }
  }, [text, type,lang,autoPlay]);
 
  return (
    <div
      className={`inline-flex items-center`}
    >
      {isAudioPlaying ? (
        <span className={`relative inline-block ${className}`} style={{width,height}}>
          <SpeakerLoudIcon className={`speakerLoud w-full h-full`} />
          <SpeakerModerateIcon className={`speakerModerate w-full h-full`} />
          <SpeakerQuietIcon className={`speakerQuiet w-full h-full`} />
        </span>
      ) : (
        <SpeakerLoudIcon
          className={`hover:text-sky-600 cursor-pointer ${className}`}
          style={{width,height}}
          onClick={handlePlay}
        />
      )}
    </div>
  );
}
