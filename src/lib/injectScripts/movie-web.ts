//import { emitter } from "@/utils/mitt";
import styles from './movie-web.css?inline';

const hosts = ["movie-web.app", "movie-web-me.vercel.app", "mw.lonelil.ru"];
const getCaptionContainer = (): HTMLElement | null => document.querySelector(
  ".text-white.absolute.flex.w-full.flex-col.items-center"
);
if (hosts.includes(location.host)) {
  const style = document.createElement('style');
  style.innerText = styles;
  document.head.appendChild(style);
  const trigger = document.createElement("div");
  trigger.style.padding = "10px";
  trigger.style.cursor = "pointer";
  trigger.style.pointerEvents = "auto";
  trigger.innerText = "🖐️";
  trigger.style.fontSize = "1.5em";
  trigger.style.opacity = "0";
  trigger.addEventListener("click", function () {
    const captionContainer = getCaptionContainer();
    if (!captionContainer) {return}
    // emitter.emit("showCard", {
    //   text: captionContainer.innerText.replace('🖐️', ''),
    //   domRect: captionContainer.getBoundingClientRect(),
    // });
  });
  const handleMouseover = () => {
    const captionContainer = getCaptionContainer();
    if (captionContainer && captionContainer.contains(trigger)) {
      return;
    }
    if (captionContainer && !captionContainer.contains(trigger)) {
      //document.removeEventListener("mouseover", handleMouseover);
      captionContainer.appendChild(trigger);
      captionContainer.addEventListener("mouseenter", function () {
        if (captionContainer.innerText.trim() !== "🖐️") {
          trigger.style.opacity = "1";
        }
      });
      captionContainer.addEventListener("mouseleave", function () {
        trigger.style.opacity = "0";
      });
    }
  };
  document.addEventListener("mouseover", handleMouseover);
}
