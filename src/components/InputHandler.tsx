import { useEffect, useCallback } from "react"
import { isLegal } from "../utils/qwertyUtil"

export default function InputHandler({ updateInput }: { updateInput: (letter:string) => void }) {
  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const char = e.key
      if (isLegal(char) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        updateInput(char)
      }
    },
    [updateInput],
  )

  useEffect(() => {

    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [onKeydown])

  return <></>
}
