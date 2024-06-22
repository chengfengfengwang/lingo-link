import { EngineItem } from "@/types";
import { defaultSetting, allWordEngineList } from "@/utils/const";
import { useTranslation } from "react-i18next";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import InfoAndReset from "@/components/InfoAndReset";
import { Info } from "lucide-react";
import { useAtom } from "jotai";
import { settingAtom } from "@/store";
class FilterPointerSensor extends PointerSensor {
  static activators: typeof PointerSensor.activators = [
    {
      eventName: "onPointerDown",
      handler({ nativeEvent: event }) {
        const target = event.target as HTMLElement;
        if (target.closest(".clickable")) {
          return false;
        }
        return true;
      },
    },
  ];
}
export default function WordEngine() {
  const [setting, setSetting] = useAtom(settingAtom);
  const { t } = useTranslation();
  const sensors = useSensors(useSensor(FilterPointerSensor));
  let engineList:EngineItem[] = [];
  if (setting.wordEngineList){
    const newAddItems = allWordEngineList.filter(defaultItem =>  !setting.wordEngineList?.find(item => item.value === defaultItem.value));
    
    if (newAddItems.length) {
      engineList = [...setting.wordEngineList,...newAddItems]
    } else {
      engineList = setting.wordEngineList
    }
  } else {
    engineList = allWordEngineList
  }
  const handleEngineChange = (engineItem: EngineItem, checked: boolean) => {
    setSetting({
      wordEngineList: engineList.map((item) => {
        if (item.value === engineItem.value) {
          return { ...engineItem, checked };
        } else {
          return item;
        }
      }),
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = engineList.findIndex((item) => active.id === item.value);
      const newIndex = engineList.findIndex((item) => over.id === item.value);
      const newItems = arrayMove(engineList, oldIndex, newIndex);
      setSetting({
        wordEngineList: newItems
      })
    }
  }
  const showPrompt = engineList.some((item) => {
    return item.isChat;
  });

  return (
    <div>
      <div className="font-semibold text-[17px] mb-3">
        {t("Translation Services for Words")}
      </div>
      <div className="border rounded-xl p-6">
        <div className="ml-1 flex items-center gap-1 text-xs text-gray-500">
          <Info className="w-[12px] h-[12px]" />
          <span>{t("EnginesTip")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={horizontalListSortingStrategy}
              items={engineList.map((item) => item.value)}
            >
              {engineList.map((item) => (
                <Item
                  key={item.value}
                  item={item}
                  onChange={handleEngineChange}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        {showPrompt && (
          <div className="mt-4">
            <div className="flex items-center">
              <div className="text-[13px] font-semibold mb-1">
                System Prompt
              </div>
              <InfoAndReset
                tip={t("Prompt Of Word System Tip")}
                onReset={() => setSetting({wordSystemPrompt: defaultSetting.wordSystemPrompt})
                }
              />
            </div>

            <textarea
              onChange={(e) =>setSetting({wordSystemPrompt: e.target.value})}
              value={setting.wordSystemPrompt ?? defaultSetting.wordSystemPrompt}
              className="w-full h-[100px]  textarea textarea-bordered"
              placeholder="System Prompt"
            ></textarea>
            <div className="flex items-center">
              <div className="text-[13px] font-semibold mb-1">User Content</div>
              <InfoAndReset
                tip={t("Prompt Of Word User Tip")}
                onReset={() =>
                  setSetting({
                    wordUserContent: defaultSetting.wordUserContent
                  })
                }
              />
            </div>
            <textarea
              onChange={(e) => setSetting({
                wordUserContent: e.target.value
              })}
              value={setting.wordUserContent ?? defaultSetting.wordUserContent}
              className="w-full h-[50px]  textarea textarea-bordered"
              placeholder="User Content"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

function Item({
  item,
  onChange,
}: {
  item: EngineItem;
  onChange: (engine: EngineItem, checked: boolean) => void;
}) {
  const { value } = item;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <div key={item.value} className="label space-x-1 cursor-pointer">
        <span className="label-text cursor-move">{item.name}</span>
        <input
          checked={item.checked}
          onChange={(e) => onChange(item, e.target.checked)}
          type="checkbox"
          className="checkbox checkbox-info clickable"
        />
      </div>
    </div>
  );
}
