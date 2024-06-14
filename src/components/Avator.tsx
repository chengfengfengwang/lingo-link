
export default function Avator({ name, uri }: { name?: string; uri?: string }) {  
  if (uri) {
    return <img className="w-[16px] h-[16px] rounded-full overflow-hidden" src={uri} />;
  }
  if (name) {
    return <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center bg-[#207398] text-white text-center text-[11px]">
     {name.startsWith('AI:') ? 'AI' :name.slice(0, 1)}
    </div>;
  }
}

