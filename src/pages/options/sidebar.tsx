import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";


export interface MenuItem {
  name: string;
  active: boolean;
  path: string;
  externalLink?: string;
}
export interface RenderMenuItem extends MenuItem {
  component?: ReactNode;
}

export default function Sidebar({
  menus,
  onMenuClick,
}: {
  menus: MenuItem[];
  onMenuClick: (param: MenuItem) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex shrink-0 flex-col bg-gray-200 pl-[40px] pr-[100px]">
      <div className="h-[50px]"></div>
      <div className="grow">
        <div className="space-y-[25px]">
          {menus.map((item) => {
            return (
              <div
                onClick={() => onMenuClick(item)}
                key={item.name}
                className={`transition-all cursor-pointer rounded-full bg-white py-[10px] px-[30px] 
              text-center min-w-[150px] ${
                item.active ? "!bg-blue-500 text-white" : "hover:bg-blue-200"
              }`}
              >
                {t(item.name)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}