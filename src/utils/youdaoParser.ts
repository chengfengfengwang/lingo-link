export interface WordExplain {
  basicResult: {
    phonetic: string[]
    explains: string[]
    pattern: string | undefined
  }
  collinsResult: {
    category: string | undefined
    phonetic: string | undefined
    star: number
    rank: any
    pattern: string | undefined
    explanations: {
      explanation: string
      examples: string[]
    }[]
  }[]
}
export type Translation = { translates: string[] }
export type YoudaoResult = WordExplain | Translation
function parseCollinsHTML(html:string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  // 获取所有翻译容器
  const transContainers = doc.querySelectorAll('#collinsResult .wt-container')
  const result = Array.from(transContainers).map((transContainer) => {
    //获取分类
    const category = transContainer
      .querySelector('.title.trans-tip span')
      ?.textContent?.trim()
      .toLowerCase()
    const phonetic = transContainer.querySelector('.phonetic')?.textContent?.trim()
    let star = 0
    const $star = transContainer.querySelector('.star')
    if ($star) {
      const starMatch = /star(\d+)/.exec(String($star.className))
      if (starMatch) {
        star = Number(starMatch[1])
      }
    }
    const rank = (transContainer.querySelector('.via.rank') as HTMLElement)?.innerText?.trim()
    const pattern = transContainer.querySelector('.additional.pattern')?.textContent?.trim()
    //在每个翻译容器中获取所有的单词解释
    const explanations = Array.from(transContainer.querySelectorAll('.ol > li')).map((li) => {
      //获取词性
      //获取词语解释，包含了英文和中文
      const explanation = (li.querySelector('.collinsMajorTrans p') as HTMLElement)?.innerText
        .replace(/\t|\n/g, '')
        .trim()
      // 获取例句。注意这里可能有多个例句
      const examples = Array.from(li.querySelectorAll('.examples p') as NodeListOf<HTMLElement>).map((p) =>
        p.textContent?.trim(),
      )
      return {
        explanation,
        examples,
      }
    })
    const invalidIndex = explanations.findIndex((e) => !e.explanation)
    if (invalidIndex !== -1) {
      explanations.splice(invalidIndex, 1)
    }
    return {
      category,
      phonetic,
      star,
      rank,
      pattern,
      explanations,
    }
  })
  return result
}
export function parseYouDaoHTML(html:string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const container = doc.querySelector('#fanyiToggle')
  if (container) {
    const translates = Array.from(container.querySelectorAll('p')).map((p: HTMLElement) =>
      p.innerText.trim(),
    )
    const length = translates.length
    return {
      translates: translates.slice(0, length - 1),
    }
  } else {
    const basicResult = parseWordBasicHTML(html)
    const collinsResult = parseCollinsHTML(html)
    return {
      basicResult,
      collinsResult,
    }
  }
}
function parseWordBasicHTML(html:string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const container = doc.querySelector('#phrsListTab')
  const phonetic = Array.from(container!.querySelectorAll('.phonetic') as NodeListOf<HTMLElement>).map((p: HTMLElement) =>
    p.innerText.trim(),
  )
  const explains = Array.from(container!.querySelectorAll('.trans-container ul>li') as NodeListOf<HTMLElement>).map(
    (t: HTMLElement) => t.innerText.trim(),
  )
  const pattern = (container!.querySelector('.additional') as HTMLElement)?.innerText?.trim()
  return {
    phonetic,
    explains,
    pattern,
  }
}