import { getSetting } from "@/storage/sync"
import {defaultSetting} from "@/utils/const.ts";

export async function genHighlightStyle() {
  const selector = `.translate_learn_extension_mark`
  const highlightStyle = (await getSetting()).highlightStyle ?? defaultSetting.highlightStyle;
  const highlightColor = (await getSetting()).highlightColor ?? defaultSetting.highlightColor
  const baseStyleText = `visibility: visible !important;` // some website like reddit will have style :not(:defined):{visibility: hidden}
  let style = ''

  switch (highlightStyle) {
    case 'none':
      return baseStyleText
    case 'text':
      style += `
    ${selector} {
      ${baseStyleText}
      color: ${highlightColor};
    }
    `
      break
    case 'background':
      style += `
    ${selector} {
      ${baseStyleText}
      color: white;
      background-color: ${highlightColor};
    }
    `
      break
    case 'dashed':
      style += `
    ${selector} {
      ${baseStyleText}
      text-decoration: underline dashed ${highlightColor};
    }
    `
      break
    case 'dotted':
      style += `
    ${selector} {
      ${baseStyleText}
      text-decoration: underline dotted ${highlightColor} 0.2em;
    }
    `
      break
    case 'underline':
      style += `
    ${selector} {
      ${baseStyleText}
      text-decoration: underline solid ${highlightColor} 0.15em;
    }
    `
      break
    case 'double-underline':
      style += `
    ${selector} {
      ${baseStyleText}
      text-decoration: underline double ${highlightColor} 0.13em;
    }
    `
      break
    case 'wavy':
      style += `
    ${selector} {
      ${baseStyleText}
      text-decoration: underline wavy ${highlightColor};
    }
    `
      break
    default:
      style += `
    ${selector} {
      ${baseStyleText}
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
