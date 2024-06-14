import { getSetting } from "@/storage/sync";
import { sendBackgroundFetch } from ".";
import { toastManager } from "@/components/Toast";
let isCapturing = false;
export default async function onCaptureScreenResult(
  dataUrl: string,
  callback: (result: string, domRect: DOMRect) => void
) {
  const token = await (await getSetting()).screenshotToken;
  if (!token) {
    toastManager.add({
      type: 'error',
      msg: 'Screenshot token is empty'
    })
    return
  }
  if (isCapturing) {
    return;
  }
  isCapturing = true;
  const exit = () => {
    img.remove();
    layerCanvas.remove();
    isCapturing = false;
  };
  const handleExit = (e?: KeyboardEvent) => {
    if (e && e.key === "Escape") {
      exit();
    }
  };
  document.addEventListener("keydown", handleExit);

  const requestBaiduOcr = async (base64: string) => {
    try {
      const searchParam = new URLSearchParams();
      searchParam.append("image", base64.split(",")[1]);
      const res = await sendBackgroundFetch({
        url: `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParam.toString(),
        responseType: "json",
      });
      if (res.error_msg) {
        toastManager.add({
          type: "error",
          msg: res.error_msg,
        });
        throw res.error_msg;
      }
      if (res.words_result_num === 0) {
        toastManager.add({
          type: "info",
          msg: "没有识别到文字",
        });
        throw "没有识别到文字";
      }
      if (res.words_result_num > 0) {
        return res.words_result
          .map((item: { words: string }) => item.words)
          .join("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const img = document.createElement("img");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  img.width = windowWidth;
  img.height = windowHeight;
  img.style.zIndex = "2147483646";
  img.style.position = "fixed";
  img.style.left = "0";
  img.style.top = "0";
  img.style.width = "100%";
  img.style.height = "auto";
  img.src = dataUrl;
  document.documentElement.appendChild(img);

  const layerCanvas = document.createElement("canvas");
  layerCanvas.style.position = "fixed";
  layerCanvas.style.top = "0";
  layerCanvas.style.left = "0";
  layerCanvas.style.zIndex = "2147483647";
  layerCanvas.style.cursor = "crosshair";
  layerCanvas.width = windowWidth;
  layerCanvas.height = windowHeight;
  const layerCtx = layerCanvas.getContext("2d")!;
  layerCtx.fillStyle = "rgba(0,0,0,0.2)";
  layerCtx.fillRect(0, 0, windowWidth, windowHeight);
  document.documentElement.appendChild(layerCanvas);
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  const reset = () => {
    layerCtx.clearRect(0, 0, windowWidth, windowHeight);
    layerCtx.fillStyle = "rgba(0,0,0,0.2)";
    layerCtx.fillRect(0, 0, windowWidth, windowHeight);
    document.documentElement.appendChild(layerCanvas);
  };
  img.onload = function () {
    layerCanvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.offsetX;
      startY = e.offsetY;
    });
    layerCanvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        reset();
        layerCtx.clearRect(
          startX,
          startY,
          e.offsetX - startX,
          e.offsetY - startY
        );
      }
    });
    layerCanvas.addEventListener("mouseup", async (e) => {
      endX = e.offsetX;
      endY = e.offsetY;
      isDragging = false;
      const newStartX = startX < endX ? startX : endX;
      const newStartY = startY < endY ? startY : endY;

      const resultCanvas = document.createElement("canvas");
      const resultCanvasCtx = resultCanvas.getContext("2d");
      resultCanvas.width = 2 * Math.abs(startX - endX);
      resultCanvas.height = 2 * Math.abs(startY - endY);

      resultCanvasCtx?.drawImage(
        img,
        newStartX * 2,
        newStartY * 2,
        resultCanvas.width,
        resultCanvas.height,
        0,
        0,
        resultCanvas.width,
        resultCanvas.height
      );
      //document.documentElement.appendChild(resultCanvas);

      exit();
      document.addEventListener("keydown", handleExit);
      const dataUrl = resultCanvas.toDataURL();
      if (resultCanvas.width === 0 || resultCanvas.height === 0) {
        return;
      }
      const result = await requestBaiduOcr(dataUrl);
      if (result) {
        callback(result, DOMRect.fromRect({
          x: newStartX,
          y: newStartY,
          width: Math.abs(startX - endX),
          height: Math.abs(startY - endY)
        }))
      }
    });
  };
}
