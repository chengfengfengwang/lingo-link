const bannedKeys = [
  "Enter",
  "Backspace",
  "Delete",
  "Tab",
  "CapsLock",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "Escape",
  "Fn",
  "FnLock",
  "Hyper",
  "Super",
  "OS",
  // Up, down, left and right keys
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  // volume keys
  "AudioVolumeUp",
  "AudioVolumeDown",
  "AudioVolumeMute",
  // special keys
  "End",
  "PageDown",
  "PageUp",
  "Clear",
  "Home",
];

export const isLegal = (key: string): boolean => {
  if (bannedKeys.includes(key)) return false;
  return true;
};
export const playSound = (url: string) => {
  const audio = document.createElement("audio");
  audio.src = url;
  audio.play();
};
export const getLetterState = ({
  inputWord,
  letter,
  letterIndex,
}: {
  inputWord: string;
  letter: string;
  letterIndex: number;
}) => {
  if (inputWord.length === 0) {
    return "normal";
  }
  // 还未输入到
  if (letterIndex > inputWord.length - 1 ) {
    return 'normal'
  } else if (letterIndex === inputWord.length - 1) { // 当前输入
    if (letter === inputWord[inputWord.length - 1]) {
      return 'correct'
    } else {
      return 'wrong'
    }
  } else {
    return 'correct'
  }
};
