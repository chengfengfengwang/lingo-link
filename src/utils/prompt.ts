import { codeBlock, oneLineTrim } from "common-tags"
import { isSameWord } from ".";
export const getWordPrompt = ({word,context,targetLanguage}:{word:string,context?:string,targetLanguage:string}) => {
  // 单词模式，可以更详细的翻译结果，包括：音标、词性、含义、双语示例。
  const rolePrompt = codeBlock`
      ${oneLineTrim`
      你是一个翻译引擎，翻译的目标语言为${targetLanguage}，只需要翻译不需要解释。
      当只给出一个单词时，
      请给出单词原始形态（如果有）、
      单词的语种、
      对应的音标或转写、
      所有含义（含词性）、
      双语示例，至少三条例句。`}


      ${oneLineTrim`当给出句子和句子中的某个单词或词组时，
      请给出单词原始形态（如果有）、
      单词的语种、
      对应的音标或转写、
      单词在句子中的含义（含词性）、
      使用该含义的三条双语例句。
      请严格按照下面格式给到翻译结果：`}
          <单词>
          [<语种>]· / <Pinyin> /
          [<词性缩写>] <中文含义>]（如果同时给出了句子，解释单词在句子中的含义）
          [<句子的含义>]（如果同时给出了句子）
          例句：
          <序号><例句>(例句翻译)
          词源：
          <词源>
      `
  const commandPrompt = '好的，我明白了，请给我这个单词。';
  let contentPrompt = '';
  if (!context || isSameWord(word,context)) {
    contentPrompt = `单词是：${word}。`
  } else {
    contentPrompt = `单词是：${word}，句子是：${context}`
  }
 
  return {rolePrompt, commandPrompt, contentPrompt}
}
export const getSentencePrompt = (text:string,targetLanguage:string) => {
  const rolePrompt = `You are a translator. Please translate the text into a colloquial, professional, elegant and fluent content, without the style of machine translation.`;
  const commandPrompt = `OK.`;
  const contentPrompt = `Translate the following text to ${targetLanguage}:${text}`;
  return {
    rolePrompt,
    commandPrompt,
    contentPrompt
  }
}