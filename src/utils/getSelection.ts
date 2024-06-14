/**
 * Returns the selected text
 */
export function getTextFromSelection(selection: Selection | null, win = window): string {
  // When called on an <iframe> that is not displayed (eg. where display: none is set)
  // Firefox will return null, whereas other browsers will return a Selection object
  // with Selection.type set to None.
  if (selection) {
    const text = selection.toString().trim()
    if (text) {
      return text
    }
  }

  // Currently getSelection() doesn't work on the content of <input> elements in Firefox
  // Document.activeElement returns the focused element.
  const activeElement = win.document.activeElement
  /* istanbul ignore else */
  if (activeElement) {
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      const el = activeElement as HTMLInputElement | HTMLTextAreaElement
      return el.value.slice(el.selectionStart || 0, el.selectionEnd || 0)
    }
  }

  return ''
}

/**
 * Returns the selected text
 */
export function getText(win = window): string {
  return getTextFromSelection(win.getSelection(), win)
}

/**
 * Returns the paragraph containing the selection text.
 */
export function getParagraphFromSelection(selection: Selection | null): string {
  if (!selection || selection.rangeCount <= 0) {
    return ''
  }

  const selectedText = selection.toString()
  if (!selectedText.trim()) {
    return ''
  }

  const range = selection.getRangeAt(0)
  // double sanity check, which is unlikely to happen due to the rangeCount check above
  /* istanbul ignore if */
  if (!range) {
    return ''
  }

  return (extractParagraphHead(range) + selectedText + extractParagraphTail(range))
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Returns the paragraph containing the selection text.
 */
export function getParagraph(win = window): string {
  return getParagraphFromSelection(win.getSelection())
}

/**
 * Returns the sentence containing the selection text.
 */
export function getSentenceFromSelection(selection: Selection | null): string {
  if (!selection || selection.rangeCount <= 0) {
    return ''
  }

  const selectedText = selection.toString()
  if (!selectedText.trim()) {
    return ''
  }

  const range = selection.getRangeAt(0)
  // double sanity check, which is unlikely to happen due to the rangeCount check above
  /* istanbul ignore if */
  if (!range) {
    return ''
  }

  return (
    extractSentenceHead(extractParagraphHead(range)) +
    selectedText +
    extractSentenceTail(extractParagraphTail(range))
  )
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Returns the sentence containing the selection text.
 */
export function getSentence(win = window): string {
  return getSentenceFromSelection(win.getSelection())
}

function extractParagraphHead(range: Range): string {
  let startNode = range.startContainer
  let leadingText = ''
  switch (startNode.nodeType) {
    case Node.TEXT_NODE: {
      const textContent = startNode.textContent
      if (textContent) {
        leadingText = textContent.slice(0, range.startOffset)
      }
      break
    }
    case Node.COMMENT_NODE:
    case Node.CDATA_SECTION_NODE:
      break
    default:
      startNode = startNode.childNodes[range.startOffset]
  }

  // parent prev siblings
  for (let node: Node | null = startNode; isInlineNode(node); node = node.parentElement) {
    for (let sibl = node.previousSibling; isInlineNode(sibl); sibl = sibl.previousSibling) {
      leadingText = getTextFromNode(sibl) + leadingText
    }
  }

  return leadingText
}

function extractParagraphTail(range: Range): string {
  let endNode = range.endContainer
  let tailingText = ''
  switch (endNode.nodeType) {
    case Node.TEXT_NODE: {
      const textContent = endNode.textContent
      if (textContent) {
        tailingText = textContent.slice(range.endOffset)
      }
      break
    }
    case Node.COMMENT_NODE:
    case Node.CDATA_SECTION_NODE:
      break
    default:
      endNode = endNode.childNodes[range.endOffset - 1]
  }

  // parent next siblings
  for (let node: Node | null = endNode; isInlineNode(node); node = node.parentElement) {
    for (let sibl = node.nextSibling; isInlineNode(sibl); sibl = sibl.nextSibling) {
      tailingText += getTextFromNode(sibl)
    }
  }

  return tailingText
}

function extractSentenceHead(leadingText: string): string {
  // split regexp to prevent backtracking
  if (leadingText) {
    const puncTester = /[.?!。？！…]/
    /** meaningful char after dot "." */
    const charTester = /[^\s.?!。？！…]/

    for (let i = leadingText.length - 1; i >= 0; i--) {
      const c = leadingText[i]
      if (puncTester.test(c)) {
        if (c === '.' && charTester.test(leadingText[i + 1])) {
          // a.b is allowed
          continue
        }
        return leadingText.slice(i + 1)
      }
    }
  }
  return leadingText
}

function extractSentenceTail(tailingText: string): string {
  // match tail                                                       for "..."
  const tailMatch = /^((\.(?![\s.?!。？！…]))|[^.?!。？！…])*([.?!。？！…]){0,3}/.exec(tailingText)
  // the regexp will match empty string so it is unlikely to have null result
  return tailMatch ? tailMatch[0] : /* istanbul ignore next */ ''
}

function getTextFromNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node as Text).nodeValue || /* istanbul ignore next */ ''
  } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') {
    return ' '
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as HTMLElement).innerText || /* istanbul ignore next: SVG? */ ''
  }
  return ''
}

function isInlineNode(node?: Node | null): node is Node {
  if (!node) {
    return false
  }

  switch (node.nodeType) {
    case Node.TEXT_NODE:
    case Node.COMMENT_NODE:
    case Node.CDATA_SECTION_NODE:
      return true
    case Node.ELEMENT_NODE: {
      switch ((node as HTMLElement).tagName) {
        case 'A':
        case 'ABBR':
        case 'B':
        case 'BDI':
        case 'BDO':
        case 'BR':
        case 'CITE':
        case 'CODE':
        case 'DATA':
        case 'DFN':
        case 'EM':
        case 'I':
        case 'KBD':
        case 'MARK':
        case 'Q':
        case 'RP':
        case 'RT':
        case 'RTC':
        case 'RUBY':
        case 'S':
        case 'SAMP':
        case 'SMALL':
        case 'SPAN':
        case 'STRONG':
        case 'SUB':
        case 'SUP':
        case 'TIME':
        case 'U':
        case 'VAR':
        case 'WBR':
        case 'TRANSLATOR':
        case 'TRANSLATOR-HIGHLIGHT':
        case 'TRANSLATOR-MASTERED':
          return true
      }
    }
  }
  return false
}
