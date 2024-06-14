import { sendBackgroundFetch } from "@/utils";

type GoogleTranslateResult  = (string|unknown)[]
export default async function  googleTranslate({text,targetLang}:{text: string, targetLang:string}) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const data:GoogleTranslateResult | {error:string} = await sendBackgroundFetch({
      url,
      responseType: 'json'
    });
    if ('error' in data) {
      throw(data.error)
    }
    let result = '';
    for(const  item0 of data) {
      if (item0 instanceof Array) {
        for (const item1 of item0) {
          if (item1 instanceof Array) {
            result += item1[0]
          }
        }
      }
      if (item0 === null) {
        return result
      }
    }      
    return result
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw(error.message)
    } else {
      throw('failed fetch')
    }
  }
}