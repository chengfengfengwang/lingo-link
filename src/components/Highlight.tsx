import { memo } from "react"

export default memo(function HighLight({
  wordString,
  context,
  highlightClassName
}: {
  wordString: string
  context: string
  highlightClassName?: string
}) {
  const restrictedContext = context.length > 200 ? context.slice(0, 200) + '...' : context
  const words = JSON.parse(wordString)
  const lowerCaseWords = words.map((item: string) => item.toLocaleLowerCase())
  const parts = restrictedContext.split(new RegExp(`(${lowerCaseWords.join("|")})`, "gi"))
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            lowerCaseWords.includes(part.trim().toLowerCase())
              ? highlightClassName ? highlightClassName : "font-bold"
              : ""
          }
        >
          {part}
        </span>
      ))}
    </span>
  )
})
