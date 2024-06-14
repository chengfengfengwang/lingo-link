import { getSetting } from "@/storage/sync";
import { Language } from "@/types";
import { formateText, sendBackgroundFetch } from "@/utils";
import { defaultSetting } from "@/utils/const";

export default async function  deeplTranslate(text: string) {
  const targetLanguage = (await getSetting()).targetLanguage ?? defaultSetting.targetLanguage;
  const urlSearch = new URLSearchParams();
  urlSearch.append('text', formateText(text));
  urlSearch.append('target_lang', targetLanguage);
  try {
    const data = await sendBackgroundFetch({
      url: 'https://api-free.deepl.com/v2/translate',
      method: 'POST',
      responseType: 'json',
      body: urlSearch.toString(),
      headers: {
        'Authorization': `DeepL-Auth-Key ${import.meta.env.VITE_DEEPL_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })      
    return data.translations[0].text
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw(error.message)
    } else {
      throw('failed fetch')
    }
  }
}
export const languages: Language[] = [
  {
    "language": "BG",
    "name": "Bulgarian",
    
  },
  {
    "language": "CS",
    "name": "Czech",
    
  },
  {
    "language": "DA",
    "name": "Danish",
    
  },
  {
    "language": "DE",
    "name": "German",
    
  },
  {
    "language": "EL",
    "name": "Greek",
    
  },
  {
    "language": "EN-GB",
    "name": "English (British)",
    
  },
  {
    "language": "EN-US",
    "name": "English (American)",
    
  },
  {
    "language": "ES",
    "name": "Spanish",
    
  },
  {
    "language": "ET",
    "name": "Estonian",
    
  },
  {
    "language": "FI",
    "name": "Finnish",
    
  },
  {
    "language": "FR",
    "name": "French",
    
  },
  {
    "language": "HU",
    "name": "Hungarian",
    
  },
  {
    "language": "ID",
    "name": "Indonesian",
    
  },
  {
    "language": "IT",
    "name": "Italian",
    
  },
  {
    "language": "JA",
    "name": "Japanese",
    
  },
  {
    "language": "KO",
    "name": "Korean",
    
  },
  {
    "language": "LT",
    "name": "Lithuanian",
    
  },
  {
    "language": "LV",
    "name": "Latvian",
    
  },
  {
    "language": "NB",
    "name": "Norwegian (Bokmål)",
    
  },
  {
    "language": "NL",
    "name": "Dutch",
    
  },
  {
    "language": "PL",
    "name": "Polish",
    
  },
  {
    "language": "PT-BR",
    "name": "Portuguese (Brazilian)",
    
  },
  {
    "language": "PT-PT",
    "name": "Portuguese (European)",
    
  },
  {
    "language": "RO",
    "name": "Romanian",
    
  },
  {
    "language": "RU",
    "name": "Russian",
    
  },
  {
    "language": "SK",
    "name": "Slovak",
    
  },
  {
    "language": "SL",
    "name": "Slovenian",
    
  },
  {
    "language": "SV",
    "name": "Swedish",
    
  },
  {
    "language": "TR",
    "name": "Turkish",
    
  },
  {
    "language": "UK",
    "name": "Ukrainian",
    
  },
  {
    "language": "ZH",
    "name": "Chinese (simplified)",
    
  }
]