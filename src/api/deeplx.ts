import { toastManager } from "@/components/Toast";
import { getSetting } from "@/storage/sync";
import { sendBackgroundFetch } from "@/utils";

type DeepLXTranslateResult  = {data:string}
export default async function  deepLXTranslate({text}:{text: string}) {
  try {
    const setting = await getSetting();    
    if (!setting.deepLXAddress) {
      toastManager.add({type: 'error', msg: 'api Address is empty. Please check settings.'});
      return
    }
    const data:DeepLXTranslateResult | {error:string} = await sendBackgroundFetch({
      url: setting.deepLXAddress,
      method: 'POST',
      body:JSON.stringify({
        text,
        source_lang: 'en',
        target_lang: 'zh'
      }),
      responseType: 'json'
    });
    if ('error' in data) {
      throw(data.error)
    }    
    return data.data
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw(error.message)
    } else {
      throw('failed fetch')
    }
  }
}