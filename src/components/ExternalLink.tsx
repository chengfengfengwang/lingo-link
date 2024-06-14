import { settingAtom } from "@/store";
import { defaultSetting } from "@/utils/const";
import { useAtom } from "jotai";
export default function ExternalLink({ searchText }: { searchText: string }) {
  const [setting] = useAtom(settingAtom);
  const links = setting.externalLinks ?? defaultSetting.externalLinks;
  return (
    <div className="flex items-center gap-1 text-xs">
      {links.map((item) => (
        <a
          key={item.id}
          className="underline"
          target={item.name}
          href={item.link.replace(/\{text\}/, function () {
            return searchText;
          })}
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}
