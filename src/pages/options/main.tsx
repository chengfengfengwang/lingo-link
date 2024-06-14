import { createRoot } from "react-dom/client";
import "@/assets/styles/tailwind.css";
import { useState, useEffect, ReactNode } from "react";
import DataManage from "./dataManage";
import { ToastContainer } from "@/components/Toast";
import Options from "./options";
import "@/i18n.ts";
import EnginesSetting from "./enginsSetting";
import ExternalLinks from "./externalLiks";
import { wordListUrl, wordListWindowName } from "@/utils/const";
import ScreenshotSetting from "./screenshotSetting";
import UpdateLog from "@/components/UpdateLog";
import Question from './question'
import Other from "./other";
import Sidebar from "./sidebar";
export interface MenuItem {
  name: string;
  active: boolean;
  path: string;
  externalLink?: string;
}
export interface RenderMenuItem extends MenuItem {
  component?: ReactNode;
}
export default function App() {
  const [menus, setMenus] = useState<RenderMenuItem[]>([
    {
      name: "Basic Settings",
      path: "/option",
      active: true,
      component: <Options />,
    },
    {
      name: "Engines Settings",
      path: "/engines",
      active: false,
      component: <EnginesSetting />,
    },
    {
      name: "External Links",
      path: "/externalLinks",
      active: false,
      component: <ExternalLinks />,
    },
    {
      name: "Vocabulary Notebook",
      path: "/wordList",
      active: false,
      component: null,
    },
    {
      name: "Words synchronization",
      path: "/dataManage",
      active: false,
      component: <DataManage />,
    },
    {
      name: "Screenshot API",
      path: "/screenshot",
      active: false,
      component: <ScreenshotSetting />,
    },
    {
      name: "Update Log",
      path: "/updateLog",
      active: false,
      component: <UpdateLog />,
    },
    {
      name: "Question",
      path: "/question",
      active: false,
      component: <Question />,
    },
    {
      name: "Other",
      path: "/other",
      active: false,
      component: <Other />,
    }
  ]);
  useEffect(() => {
    if (!location.hash.includes("#")) {
      return;
    }
    const name = decodeURIComponent(location.hash.split("#")[1]);
    setMenus(
      menus.map((menu) => {
        if (menu.name === name) {
          return { ...menu, ...{ active: true } };
        } else {
          return { ...menu, ...{ active: false } };
        }
      })
    );
  }, [menus]);
  const onMenuClick = async (item: MenuItem) => {
    if (item.path === "/wordList") {
      window.open(wordListUrl, wordListWindowName);
      return;
    }
    if (item.externalLink) {
      window.open(item.externalLink);
      return;
    }
    // if (item.name === '生词本') {
    //   const setting = await getSettingSyncStorage()
    //   if (setting?.catWordsAccount && setting?.catWordsAccount?.token) {
    //     window.open('https://www.mywords.cc');
    //   }
    // }
    setMenus(
      menus.map((menu) => {
        if (menu.name === item.name) {
          return { ...menu, ...{ active: true } };
        } else {
          return { ...menu, ...{ active: false } };
        }
      })
    );
  };
  const activeItem = menus.filter((item) => item.active);
  return (
    <>
      <div className="flex text-[16px]">
        <Sidebar
          menus={menus.map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { component, ...restObj } = item;
            return restObj;
          })}
          onMenuClick={onMenuClick}
        />
        <div className="grow bg-white h-[100vh] overflow-y-scroll">
          <div className="mx-auto py-[40px] max-w-2xl">
            {activeItem[0].component}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
createRoot(document.querySelector("#root")!).render(<App />);
