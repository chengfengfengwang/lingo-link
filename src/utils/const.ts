import { Language } from "@/types";
//import { codeBlock, oneLineTrim } from "common-tags";
const formatZhCode = (str: string) => {
  if (/zh/.test(str) && str !== "zh-Hans" && str !== "zh-Hant") {
    return "zh-Hans";
  } else {
    return str;
  }
};
//const isDev = import.meta.env.DEV;
export const defaultCardWidth = 500;
export const defaultCardMinHeight = 150;

export const defaultTranslateMaxWidth = 500;
export const defaultTranslateWidth = 500;
export const defaultTranslateMinHeight = 100;
export const wordListUrl = "https://words.mywords.cc";
  //export const wordListUrl = "https://words.mywords.cc/";
export const isWordListPage = location.href === wordListUrl;
export const wordListWindowName = "wordList";
export const supportLanguages: Language[] = [
  {
    language: "en",
    name: "English",
  },
  {
    language: "zh",
    name: "Chinese",
  },
  {
    language: "ja",
    name: "Japanese",
  },
  {
    language: "ko",
    name: "Korean",
  },
  {
    language: "fr",
    name: "French",
  },
];
export const defaultSetting = {
  openAIKey: "",
  openAIAddress: "https://api.openai.com/v1/chat/completions",
  openAIModel: "gpt-4o",
  engine: "google",
  targetLanguage: formatZhCode(navigator.language),
  sourceLanguage: {
    language: "en",
    name: "English",
  },
  showSelectionIcon: true,
  interfaceLanguage: navigator.language === "en" ? "en" : "zh",
  autoPronounce: false,
  triggerIconSize: 30,
  // availableEngines: [
  //   {
  //     name: "Youdao",
  //     value: "youdao",
  //   },
  //   {
  //     name: "Google",
  //     value: "google",
  //   },
  // ] as EngineItem[],
  // wordSystemPrompt: codeBlock`
  //   ${oneLineTrim`
  //   你是一个翻译引擎，翻译的目标语言为{targetLanguage}，只需要翻译不需要解释。
  //   当给出一个单词时，
  //   请给出单词原始形态（如果有）、
  //   单词的语种、
  //   对应的音标或转写、
  //   所有含义（含词性）、
  //   双语示例，三条例句。
  //   请严格按照下面格式给到翻译结果：`}
  //       <单词>
  //       [<语种>]· / <Pinyin> /
  //       [<词性缩写>] <中文含义>]（如果同时给出了句子，解释单词在句子中的含义）
  //       [<句子的含义>]（如果同时给出了句子）
  //       例句：
  //       <序号><例句>(例句翻译)
  //       词源：
  //       <词源>
  // `,
  wordSystemPrompt:'我正在学习英语，接下来我会提供给你一个句子和这个句子中的一个单词，请以牛津英汉词典的格式解释句子中的这个单词的含义，并举出一个英文例句，同时把英文例句翻译成中文',
  //wordUserContent: `单词是：{word}`,
  wordUserContent:'单词是：{word}，句子是{sentence}',
  sentenceSystemPrompt: `You are a translation AI. You only need to provide the translation result without adding any irrelevant content.`,
  sentenceUserContent: `Translate the following text to {targetLanguage}:{sentence}`,
  externalLinks: [
    {
      id: "1",
      name: "百度翻译",
      link: "https://fanyi.baidu.com/#en/zh/{text}",
    },
    {
      id: "2",
      name: "朗文",
      link: "https://www.ldoceonline.com/dictionary/{text}",
    },
    {
      id: "3",
      name: "柯林斯",
      link: "https://www.collinsdictionary.com/zh/dictionary/english/{text}",
    },
  ],
  engineList: [
    {
      name: "Youdao",
      value: "youdao",
      isChat: false,
      checked:true,
      compatible: 'both',
    },
    {
      name: "Collins",
      value: "collins",
      isChat: false,
      checked:true,
      compatible: 'word',
    },
    {
      name: "Google",
      value: "google",
      isChat: false,
      checked:true,
      compatible: 'sentence',
    },
    {
      name: "OpenAI",
      value: "openai",
      isChat: true,
      checked:false,
      compatible: 'both',
    },
    {
      name: "Gemini",
      value: "gemini",
      isChat: true,
      checked:false,
      compatible: 'both',
    },
    {
      name: "文心一言",
      value: "wenxin",
      isChat: true,
      checked:false,
      compatible: 'both',
    },
    {
      name: "DeepSeek",
      value: "deepseek",
      isChat: true,
      checked:false,
      compatible: 'both',
    },
    {
      name: "moonshot",
      value: "moonshot",
      isChat: true,
      checked:false,
      compatible: 'both',
    },
    {
      name: "DeepLX",
      value: "deeplx",
      isChat: false,
      checked:false,
      compatible: 'sentence',
    },
    {
      name: "Custom",
      value: "custom",
      isChat: true,
      checked:false,
      compatible: 'both',
    }
  ]
};
export const allWordEngineList = defaultSetting.engineList.filter(item => item.compatible !== 'sentence');
export const allSentenceEngineList = defaultSetting.engineList.filter(item => item.compatible !== 'word');

export const SourceLanguage: Language[] = [
  { name: "English", nameEn: "English", language: "en" },
  { name: "简体中文", nameEn: "Simplified Chinese", language: "zh" },
  { name: "日本語", nameEn: "Japanese", language: "ja" },
  { name: "한국어", nameEn: "Korean", language: "ko" },
  { name: "한국어 반말", nameEn: "Korean", language: "ko-banmal" },
  { name: "Français", nameEn: "French", language: "fr" },
  { name: "Deutsch", nameEn: "German", language: "de" },
  { name: "Español", nameEn: "Spanish", language: "es" },
  { name: "Italiano", nameEn: "Italian", language: "it" },
  { name: "Русский", nameEn: "Russian", language: "ru" },
  { name: "Português", nameEn: "Portuguese", language: "pt" },
  { name: "Nederlands", nameEn: "Dutch", language: "nl" },
  { name: "Polski", nameEn: "Polish", language: "pl" },
  { name: "العربية", nameEn: "Arabic", language: "ar" },
  { name: "Afrikaans", nameEn: "Afrikaans", language: "af" },
  { name: "አማርኛ", nameEn: "Amharic", language: "am" },
  { name: "Azərbaycan", nameEn: "Azerbaijani", language: "az" },
  { name: "Беларуская", nameEn: "Belarusian", language: "be" },
  { name: "Български", nameEn: "Bulgarian", language: "bg" },
  { name: "বাংলা", nameEn: "Bengali", language: "bn" },
  { name: "Bosanski", nameEn: "Bosnian", language: "bs" },
  { name: "Català", nameEn: "Catalan", language: "ca" },
  { name: "Cebuano", nameEn: "Cebuano", language: "ceb" },
  { name: "Corsu", nameEn: "Corsican", language: "co" },
  { name: "Čeština", nameEn: "Czech", language: "cs" },
  { name: "Cymraeg", nameEn: "Welsh", language: "cy" },
  { name: "Dansk", nameEn: "Danish", language: "da" },
  { name: "Ελληνικά", nameEn: "Greek", language: "el" },
  { name: "Esperanto", nameEn: "Esperanto", language: "eo" },
  { name: "Eesti", nameEn: "Estonian", language: "et" },
  { name: "Euskara", nameEn: "Basque", language: "eu" },
  { name: "فارسی", nameEn: "Persian", language: "fa" },
  { name: "Suomi", nameEn: "Finnish", language: "fi" },
  { name: "Fijian", nameEn: "Fijian", language: "fj" },
  { name: "Frysk", nameEn: "Frisian", language: "fy" },
  { name: "Gaeilge", nameEn: "Irish", language: "ga" },
  { name: "Gàidhlig", nameEn: "Scottish Gaelic", language: "gd" },
  { name: "Galego", nameEn: "Galician", language: "gl" },
  { name: "ગુજરાતી", nameEn: "Gujarati", language: "gu" },
  { name: "Hausa", nameEn: "Hausa", language: "ha" },
  { name: "Hawaiʻi", nameEn: "Hawaiian", language: "haw" },
  { name: "עברית", nameEn: "Hebrew", language: "he" },
  { name: "हिन्दी", nameEn: "Hindi", language: "hi" },
  { name: "Hmong", nameEn: "Hmong", language: "hmn" },
  { name: "Hrvatski", nameEn: "Croatian", language: "hr" },
  { name: "Kreyòl Ayisyen", nameEn: "Haitian Creole", language: "ht" },
  { name: "Magyar", nameEn: "Hungarian", language: "hu" },
  { name: "Հայերեն", nameEn: "Armenian", language: "hy" },
  { name: "Bahasa Indonesia", nameEn: "Indonesian", language: "id" },
  { name: "Igbo", nameEn: "Igbo", language: "ig" },
  { name: "Íslenska", nameEn: "Icelandic", language: "is" },
  { name: "Jawa", nameEn: "Javanese", language: "jw" },
  { name: "ქართული", nameEn: "Georgian", language: "ka" },
  { name: "Қазақ", nameEn: "Kazakh", language: "kk" },
  { name: "Монгол хэл", nameEn: "Mongolian", language: "mn" },
  { name: "Türkçe", nameEn: "Turkish", language: "tr" },
  { name: "ئۇيغۇر تىلى", nameEn: "Uyghur", language: "ug" },
  { name: "Українська", nameEn: "Ukrainian", language: "uk" },
  { name: "اردو", nameEn: "Urdu", language: "ur" },
  { name: "Tiếng Việt", nameEn: "Vietnamese", language: "vi" },
  { name: "Svenska", nameEn: "Swedish", language: "sv" },
  { name: "ไทย", nameEn: "Thai", language: "th" },
] as const;
export const AllLanguage: Language[] = [
  { name: "--Please Select--", language: "" },
  { name: "English", nameEn: "English", language: "en" },
  { name: "American English", nameEn: "English (US)", language: "en-US" },
  { name: "British English", nameEn: "English (UK)", language: "en-GB" },
  { name: "Canadian English", nameEn: "English (Canada)", language: "en-CA" },
  {
    name: "Australian English",
    nameEn: "English (Australia)",
    language: "en-AU",
  },
  { name: "简体中文", nameEn: "Simplified Chinese", language: "zh-Hans" },
  { name: "繁體中文", nameEn: "Traditional Chinese", language: "zh-Hant" },
  { name: "粤语", nameEn: "Cantonese", language: "yue" },
  { name: "古文", nameEn: "Classical Chinese", language: "lzh" },
  { name: "近代白话文", nameEn: "Modern Standard Chinese", language: "jdbhw" },
  { name: "现代白话文", nameEn: "Contemporary Chinese", language: "xdbhw" },
  { name: "日本語", nameEn: "Japanese", language: "ja" },
  { name: "한국어", nameEn: "Korean", language: "ko" },
  { name: "한국어 반말", nameEn: "Korean", language: "ko-banmal" },
  { name: "Français", nameEn: "French", language: "fr" },
  { name: "Deutsch", nameEn: "German", language: "de" },
  { name: "Español", nameEn: "Spanish", language: "es" },
  { name: "Italiano", nameEn: "Italian", language: "it" },
  { name: "Русский", nameEn: "Russian", language: "ru" },
  { name: "Português", nameEn: "Portuguese", language: "pt" },
  { name: "Nederlands", nameEn: "Dutch", language: "nl" },
  { name: "Polski", nameEn: "Polish", language: "pl" },
  { name: "العربية", nameEn: "Arabic", language: "ar" },
  { name: "Afrikaans", nameEn: "Afrikaans", language: "af" },
  { name: "አማርኛ", nameEn: "Amharic", language: "am" },
  { name: "Azərbaycan", nameEn: "Azerbaijani", language: "az" },
  { name: "Беларуская", nameEn: "Belarusian", language: "be" },
  { name: "Български", nameEn: "Bulgarian", language: "bg" },
  { name: "বাংলা", nameEn: "Bengali", language: "bn" },
  { name: "Bosanski", nameEn: "Bosnian", language: "bs" },
  { name: "Català", nameEn: "Catalan", language: "ca" },
  { name: "Cebuano", nameEn: "Cebuano", language: "ceb" },
  { name: "Corsu", nameEn: "Corsican", language: "co" },
  { name: "Čeština", nameEn: "Czech", language: "cs" },
  { name: "Cymraeg", nameEn: "Welsh", language: "cy" },
  { name: "Dansk", nameEn: "Danish", language: "da" },
  { name: "Ελληνικά", nameEn: "Greek", language: "el" },
  { name: "Esperanto", nameEn: "Esperanto", language: "eo" },
  { name: "Eesti", nameEn: "Estonian", language: "et" },
  { name: "Euskara", nameEn: "Basque", language: "eu" },
  { name: "فارسی", nameEn: "Persian", language: "fa" },
  { name: "Suomi", nameEn: "Finnish", language: "fi" },
  { name: "Fijian", nameEn: "Fijian", language: "fj" },
  { name: "Frysk", nameEn: "Frisian", language: "fy" },
  { name: "Gaeilge", nameEn: "Irish", language: "ga" },
  { name: "Gàidhlig", nameEn: "Scottish Gaelic", language: "gd" },
  { name: "Galego", nameEn: "Galician", language: "gl" },
  { name: "ગુજરાતી", nameEn: "Gujarati", language: "gu" },
  { name: "Hausa", nameEn: "Hausa", language: "ha" },
  { name: "Hawaiʻi", nameEn: "Hawaiian", language: "haw" },
  { name: "עברית", nameEn: "Hebrew", language: "he" },
  { name: "हिन्दी", nameEn: "Hindi", language: "hi" },
  { name: "Hmong", nameEn: "Hmong", language: "hmn" },
  { name: "Hrvatski", nameEn: "Croatian", language: "hr" },
  { name: "Kreyòl Ayisyen", nameEn: "Haitian Creole", language: "ht" },
  { name: "Magyar", nameEn: "Hungarian", language: "hu" },
  { name: "Հայերեն", nameEn: "Armenian", language: "hy" },
  { name: "Bahasa Indonesia", nameEn: "Indonesian", language: "id" },
  { name: "Igbo", nameEn: "Igbo", language: "ig" },
  { name: "Íslenska", nameEn: "Icelandic", language: "is" },
  { name: "Jawa", nameEn: "Javanese", language: "jw" },
  { name: "ქართული", nameEn: "Georgian", language: "ka" },
  { name: "Қазақ", nameEn: "Kazakh", language: "kk" },
  { name: "Монгол хэл", nameEn: "Mongolian", language: "mn" },
  { name: "Türkçe", nameEn: "Turkish", language: "tr" },
  { name: "ئۇيغۇر تىلى", nameEn: "Uyghur", language: "ug" },
  { name: "Українська", nameEn: "Ukrainian", language: "uk" },
  { name: "اردو", nameEn: "Urdu", language: "ur" },
  { name: "Tiếng Việt", nameEn: "Vietnamese", language: "vi" },
  { name: "Svenska", nameEn: "Swedish", language: "sv" },
  { name: "ไทย", nameEn: "Thai", language: "th" },
] as const;
export type LangCode = (typeof AllLanguage)[number]["language"];
export const extensionId = "ahhlnchdiglcghegemaclpikmdclonmo";
export const enginePicArr = {
  youdao:
    "https://qph.cf2.poecdn.net/main-thumb-pb-1091482-200-ufgqhqgohdggdfzitfacamfxuamtfbye.jpeg",
  google:
    "https://qph.cf2.poecdn.net/main-thumb-pb-3655359-200-eomiajapmpmpgnwktjnxhcfbdlueukgq.jpeg",
  openai:
    "https://qph.cf2.poecdn.net/main-thumb-pb-3004-200-jougqzjtwfqfyqprxbdwofvnwattmtrg.jpeg",
  gemini:
    "https://qph.cf2.poecdn.net/main-thumb-pb-3669463-200-hqyxuiygtmnetolnimubmwhakbsueapd.jpeg",
  wenxin:
    "https://qph.cf2.poecdn.net/main-thumb-pb-3669463-200-hqyxuiygtmnetolnimubmwhakbsueapd.jpeg",
  moonshot:
    "https://qph.cf2.poecdn.net/main-thumb-pb-1160656-200-rzstcnvivfmlwjkijfkbhhpclcrjhopa.jpeg",
};
