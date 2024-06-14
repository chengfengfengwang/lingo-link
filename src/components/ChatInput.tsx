import { useState, useRef, useEffect } from 'react'
import SendIcon from './SendIcon'
//import { useCardContext } from '@/context/cardContext'
// import useActionList from '@/hooks/useActionList'

export default function ChatInput ({
  onSubmit,
  placeholder
}: {
  onSubmit: (msg: string) => void
  placeholder?: string
}) {

  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = () => {
    if (value.trim() === '') return
    onSubmit(value.trim())
    setValue('')
  }
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    const value = event.target.value
    setValue(value)
  }

  useEffect(() => {
    if (textareaRef.current) {
      if (value) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight || 21}px`
        if (textareaRef.current.scrollHeight > 150) {
          textareaRef.current.style.overflowY = 'scroll'
        }
      } else {
        textareaRef.current.style.height = `21px`
      }
    }
  }, [value])
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
      setValue('')
    }
  }

  return (
    <div className="relative px-2 pb-2">
      <div
        className={`relative transition bg-base-300  rounded-md`}
      >
        <div
          className={`flex p-[4px] justify-between items-end`}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={(e)=>e.stopPropagation()}
            onKeyPress={(e)=>e.stopPropagation()}
            placeholder={placeholder?placeholder:''}
            className="bg-inherit flex-grow placeholder:text-base-content/50 w-full shadow-none overflow-hidden  max-h-[150px] text-[14px] p-0 m-0 border-0 focus:ring-0 appearance-none resize-none -translate-y-[3px]"
            autoFocus
          ></textarea>
          <button
            onClick={handleSubmit}
            disabled={Boolean(!value)}
            className={`w-[28px] h-[28px] cursor-pointer transition ${
              value && 'bg-neutral hover:bg-neutral-600'
            } rounded-md p-1 text-white disabled:text-gray-400`}
          >
            <SendIcon className="w-full h-full"></SendIcon>
          </button>
        </div>
      </div>
    </div>
  )
}
