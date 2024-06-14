import { getSetting } from "@/storage/sync"

export const addWordOulu = async (word:string) => {
  const ouluInfo = (await getSetting()).ouluInfo;
  if (!ouluInfo?.token || !ouluInfo?.targetBookLang || !ouluInfo?.targetBookId || !ouluInfo.open) {
    return
  }
  fetch('https://api.frdic.com/api/open/v1/studylist/words', {
    method: 'POST',
    headers: {
      Authorization: ouluInfo.token,
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      id: ouluInfo.targetBookId,
      language: ouluInfo.targetBookLang,
      words: [word]
    })
  })
}
export const removeWordOulu = async (word:string) => {
  const ouluInfo = (await getSetting()).ouluInfo;
  if (!ouluInfo?.token || !ouluInfo?.targetBookLang || !ouluInfo?.targetBookId || !ouluInfo.open) {
    return
  }
  fetch('https://api.frdic.com/api/open/v1/studylist/words', {
    method: 'DELETE',
    headers: {
      Authorization: ouluInfo.token,
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      id: ouluInfo.targetBookId,
      language: ouluInfo.targetBookLang,
      words: [word]
    })
  })
}