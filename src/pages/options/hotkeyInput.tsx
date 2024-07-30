import { settingAtom } from '@/store';
import hotkeys from 'hotkeys-js';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
hotkeys.filter = function(){
  return true;
}

export default function HotkeysInput() {
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [setting,setSetting] = useAtom(settingAtom);
  useEffect(()=>{
    const handleKeyPress = () => {      
      if (document.activeElement ===  inputRef.current) {
        setSetting({
          shoutcut: hotkeys.getPressedKeyString().join('+')
        })
      }
    }
    hotkeys('*', handleKeyPress);
    return ()=>{
      hotkeys.unbind()
    }
  }, [setSetting])
  return <input value={setting.shoutcut} tabIndex={-1} readOnly className='input input-bordered select-none focus:border-2 focus:border-sky-500' ref={inputRef} />
}