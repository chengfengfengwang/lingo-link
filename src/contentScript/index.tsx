import "@/lib/webcomponents-bundle.js";
import React from "react";
import ReactDOM from "react-dom/client";
import shadowDomStyle from "@/assets/styles/tailwind.css?inline";
import speakerStyle from "@/assets/styles/sperkerMotion.css?inline";
import { useState, useEffect } from "react";

import "@/lib/injectScripts";
import "@/i18n.ts";
import LingoCard from './lingoCard'
import {genHighlightStyle} from "@/contentScript/highlightStyle.tsx";
class LingoLink extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "closed" });
    const reactRoot = document.createElement("div");
    reactRoot.classList.add(
      ...[
        "bg-base-100",
        "text-base-content",
        "!text-[14px]",
        "text-left",
        "leading-normal",
        "select-text",
        "visible",
      ]
    );
    reactRoot.setAttribute("data-theme", "light");
    const style = document.createElement("style");
    style.innerText = shadowDomStyle + speakerStyle;
    shadowRoot.appendChild(style);

    ReactDOM.createRoot(reactRoot).render(
      <React.StrictMode>
        <SupportFullScreen />
      </React.StrictMode>
    );
    shadowRoot?.appendChild(reactRoot);
  }
}
if (!customElements.get("lingo-link")) {
  customElements.define("lingo-link", LingoLink);
  document.documentElement.appendChild(document.createElement("lingo-link"));
}
const style = document.createElement("style");
style.innerText = await genHighlightStyle();
document.head.appendChild(style);

export function SupportFullScreen() { 
  const [v, setV] = useState(0);
  useEffect(() => {
    const handleFullScreen = function () {
      if (document.fullscreenElement) {
        document.fullscreenElement.appendChild(
          document.querySelector("lingo-link")!
        );
        setV((pre) => pre + 1);
      } else {
        document.documentElement.appendChild(
          document.querySelector("lingo-link")!
        );
        setV((pre) => pre + 1);
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreen);
    };
  }, []);
  return <LingoCard key={v} />;
}
