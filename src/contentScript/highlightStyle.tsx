import { getSetting } from "@/storage/sync"
import {defaultSetting, highlightStyles} from "@/utils/const.ts";

export async function genHighlightStyle() {
  const selector = `.translate_learn_extension_mark`
  const highlightStyle = (await getSetting()).highlightStyle ?? highlightStyles[0]
  const highlightColor = (await getSetting()).highlightColor ?? defaultSetting.highlightColor

  let style = ''

  switch (highlightStyle) {
    case 'none':
      return ''
    case 'text':
      style += `
    ${selector} {
      cursor: pointer;
      color: ${highlightColor};
    }
    `
      break
    case 'background':
      style += `
    ${selector} {
      cursor: pointer;
      color: white;
      background-color: ${highlightColor};
    }
    `
      break
    case 'dashed':
      style += `
    ${selector} {
      cursor: pointer;
      text-decoration: underline dashed ${highlightColor};
    }
    `
      break
    case 'dotted':
      style += `
    ${selector} {
      cursor: pointer;
      text-decoration: underline dotted ${highlightColor} 0.2em;
    }
    `
      break
    case 'underline':
      style += `
    ${selector} {
      cursor: pointer;
      text-decoration: underline solid ${highlightColor} 0.15em;
    }
    `
      break
    case 'double-underline':
      style += `
    ${selector} {
      cursor: pointer;
      text-decoration: underline double ${highlightColor} 0.13em;
    }
    `
      break
    case 'wavy':
      style += `
    ${selector} {
      cursor: pointer;
      text-decoration: underline wavy ${highlightColor};
    }
    `
      break
    default:
      style += `
    ${selector} {
      cursor: pointer;
      background-color: ${highlightColor};
    }
    `
      break
  }

  if (highlightStyle == 'background') {
    style += `
    ${selector}:hover {
      cursor: pointer;
      color: ${highlightColor};
      background-color: white;
    }
    `
  } else {
    style += `
    ${selector}:hover {
      cursor: pointer;
      color: white;
      background-color: ${highlightColor};
      text-decoration: none;
    }
    `
  }

  return style
}
