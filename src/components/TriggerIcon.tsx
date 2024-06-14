import triggerIcon from "@/assets/trigger.png";
const defaultIconUrl = new URL(triggerIcon, import.meta.url).href;

export default function TriggerIcon({
  x,
  y,
  show,
  size,
  url,
  onClick,
}: {
  x: number,
  y: number,
  size:number,
  url: string |undefined,
  show: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onClick(event)
  }
  return (
    <div
      onClick={handleClick}
      style={{ left: `${x}px`, top: `${y}px`,width:size,height:size }}
      className={`${
        show ? "visible" : "invisible"
      } cursor-pointer absolute z-[2147483647] select-none`}
    >
      <img className="w-full h-full rounded-md chat-cat-icon" src={url ?? defaultIconUrl} alt="" />
    </div>
  );
}
