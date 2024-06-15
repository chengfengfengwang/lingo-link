export const ignoreTags = [
  "CODE",
  "PICTURE",
  "SVG",
  "TIME",
  "CITE",
  "STYLE",
  "INPUT",
  "SELECT",
  "OPTION",
  "TEXTAREA",
  "SCRIPT",
  "NOSCRIPT",
  // "TRANSLATOR-HIGHLIGHT",
  // "TRANSLATOR-MASTERED",
  // "TRANSLATOR-ROW",
  // "TRANSLATED-BLOCK",
  // "TRANSLATOR",
];
export const regularTags = [
  "CAT-TRANSLATOR",
  "HEADER",
  "NAV",
  "FORM",
  "LABEL",
  "SECTION",
  "ARTICLE",
  "FOOTER",
  "MAIN",
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  "TH",
  "TD",
  "FIGURE",
  "FIGCAPTION",
  "DETAILS",
  "SUMMARY",
  "FIELDSET",
  "LEGEND",
  "ASIDE",
  "BUTTON",
  "UL",
  "OL",
  "STRONG",
  "BODY",
  "A",
  "B",
  "I",
  "EM",
  "DIV",
  "P",
  "SPAN",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "LI",
];

export const treeWalkerMark = ({
  target,
  words,
  mouseoverCallback,
  mouseoutCallback,
}: {
  target: Node;
  words: string[];
  mouseoverCallback?: ({ ele }: { ele: HTMLElement }) => void;
  mouseoutCallback?: ()=>void
}) => {
  //const timer = Date.now() + ''
  //console.log("--invoke treeWalker--");
  //console.time(timer)  
  // fix only one world and click master bug
  if (words instanceof Array && words.length === 0) {
    const list = document.querySelectorAll('translator-highlight');
    list.forEach(item => {
      item.parentElement?.replaceWith(item.parentElement.innerText)
    })
  }
  if (!words || words.length === 0) return;
  
  const wordJoinString = words.map((item) => `\\b${item}\\b`).join("|");
  const reg = new RegExp(wordJoinString, "i");
  const globalReg = new RegExp(wordJoinString, "ig");
  
  //const collectDom = [];

  function collectDom (target:Node) {
    //console.time('collectDom')
    const needAddList = [];
    const needRemoveList = [];
    const treeWalker = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      (node) => {
        if (node?.parentElement?.classList.contains("sr-only")) {
          return NodeFilter.FILTER_REJECT;
        }
        if (
          node?.parentElement?.getAttribute("contenteditable") ||
          node?.parentElement?.closest('[lingo-ignore="true"]') ||
          node?.parentElement?.closest('[contenteditable="true"]')
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        //console.log(node.parentElement?.nodeName);
        
        if (ignoreTags.includes(node.parentElement?.nodeName ?? "")) {
          return NodeFilter.FILTER_REJECT;
        } else {
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode as Text;
      const nodeData = node.data;
      if (node.parentElement?.nodeName === 'TRANSLATOR-HIGHLIGHT' && (!reg.test(nodeData))) {        
        needRemoveList.push(node)
      } else if (node.parentElement?.nodeName !== 'TRANSLATOR-HIGHLIGHT' && reg.test(nodeData)&& node.parentElement?.checkVisibility()) {        
        needAddList.push(node);
      }
    }
    //console.timeEnd('collectDom')
    return [needAddList, needRemoveList]
  }
  const [needAddList, needRemoveList] = collectDom(target);
  
  for (const item of needAddList) {
    setTimeout(() => {
      insertTag(item, globalReg);
    }, 10);
  }
  for (const item of needRemoveList) {
    setTimeout(() => {
      removeTag(item);
    }, 0);
  }
  function removeTag(node:Text) {
    if (node.parentElement?.tagName === 'TRANSLATOR-HIGHLIGHT') {
      node.parentElement?.replaceWith(node.parentElement.innerText)
    }
  }
  function insertTag(node: Text, reg: RegExp) {
    //console.time('insertTag');
    
    const matchFn = (match: string) => {
      return `<translator-highlight translator_highlight_id=${match} class="translate_extension_mark translate_learn_extension_mark">${match}</translator-highlight>`;
    };
    const nodeData = node.data;
    const newElement = document.createElement("translator");
    newElement.className = "translate_learn_extension_row";
    newElement.innerHTML = nodeData.replace(reg, matchFn);
    mouseoverCallback && newElement.addEventListener("mouseover", function (event) {
      if (event.buttons){return}
      const target = event.target as HTMLElement;
      if (target.tagName === "TRANSLATOR-HIGHLIGHT") {
        mouseoverCallback({ ele: target });
      }
    });
    mouseoutCallback && newElement.addEventListener("mouseout", function (event) {
      if (event.buttons){return}
      const target = event.target as HTMLElement;
      if (target.tagName === "TRANSLATOR-HIGHLIGHT") {
        mouseoutCallback();
      }
    });
    node.replaceWith(newElement);
    //console.timeEnd('insertTag')
  }
  //console.timeEnd(timer)
};
export const unMarkAll = () => {
  console.time('unmark')
  const highlighTags = document.querySelectorAll(".translate_extension_mark");
  for (const tag of highlighTags) {
    const markRow = tag.closest(".translate_learn_extension_row");
    markRow?.replaceWith((markRow as HTMLElement).innerText);

    //originParentElement.innerText = originParentElement.innerText;
  }
  console.timeEnd('unmark')
};
