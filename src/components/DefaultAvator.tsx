export default function DefaultAvator({name}:{name:string}) {
  return <div className="bg-[#9ca382] text-xs w-[30px] h-[30px] text-white rounded-full flex items-center justify-center">
    {name.slice(0,2).toUpperCase()}
  </div>
}