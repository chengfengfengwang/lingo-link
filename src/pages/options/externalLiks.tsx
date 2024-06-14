import { defaultSetting } from "@/utils/const";
import { useTranslation } from "react-i18next";
import { SquarePen, Trash2, RotateCw, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ExternalLink } from "@/types";
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
const showModal = () => {
  (document.getElementById("modal") as HTMLDialogElement).showModal();
};
const closeModal = () => {
  (document.getElementById("modal") as HTMLDialogElement).close();
};
export default function ExternalLinks() {
  const { t } = useTranslation();
  const [setting,setSetting] = useAtom(settingAtom);
  const sensors = useSensors(useSensor(FilterPointerSensor));
  const [dialogItem, setDialogItem] = useState<ExternalLink | null>(null);
  const items = setting.externalLinks ?? defaultSetting.externalLinks;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => active.id === item.id);
      const newIndex = items.findIndex((item) => over.id === item.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setSetting({externalLinks: newItems})
    }
  }
  const closeConfirm = () => {
    (document.activeElement as HTMLElement).blur();
  };
  const onAdd = () => {
    showModal();
  };
  const reset = () => {
    setSetting({externalLinks: defaultSetting.externalLinks})

  };
  const onRemove = (submitItem: ExternalLink) => {
    setSetting({externalLinks: items.filter((item) => item.id !== submitItem.id)})

  };
  const onSubmit = (submitItem: ExternalLink) => {
    if (items.find((item) => submitItem.id === item.id)) {
      setSetting({externalLinks:items.map((item) => {
        if (item.id !== submitItem.id) {
          return item;
        } else {
          return submitItem;
        }
      })})

    } else {
      setSetting({
        externalLinks: [...items, submitItem]
      })
    }
    closeModal();
  };
  return (
    <div className="w-[600px]">
      <div className="mt-4">
        <div onClick={onAdd} className="btn btn-neutral btn-sm mr-2">
          <Plus className="w-[14px] h-[14px]" />
          {t("Add")}
        </div>
        <div className="dropdown">
          <button tabIndex={0} role="button" className="btn btn-neutral btn-sm">
            <RotateCw className="w-[14px] h-[14px]" />
            {t("Reset To Initial Settings")}
          </button>
          <div
            tabIndex={0}
            className="dropdown-content card card-compact w-[170px] bg-base-200 text-base-content text-xs"
          >
            <div className="card-body items-center text-center">
              <p className="text-[13px]">{t("Confirm Question")}</p>
              <div className="card-actions justify-end">
                <button
                  onMouseDown={closeConfirm}
                  className="btn btn-xs btn-primary"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={() => {
                    closeConfirm();
                    reset();
                  }}
                  className="btn btn-xs btn-ghost"
                >
                  {t("Confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onEdit={() => setDialogItem(item)}
              onRemove={() => onRemove(item)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <EditDialog item={dialogItem} onSubmit={onSubmit} />
    </div>
  );
}

function Item({
  item,
  onEdit,
  onRemove,
}: {
  item: ExternalLink;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const { id, name, link } = item;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const edit = () => {
    showModal();
    onEdit();
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move group my-4 flex justify-between space-x-1 items-center  p-4  rounded-lg border text-sm"
    >
      <div className="w-[100px] mr-2 whitespace-nowrap text-ellipsis">
        {name}
      </div>
      <div className="flex-grow">{link}</div>
      <button
        onClick={edit}
        className="clickable mr-2 group-hover:opacity-100 opacity-0 btn btn-xs btn-square"
      >
        <SquarePen className="w-4 h-4" />
      </button>
      <button
        onClick={onRemove}
        className="clickable group-hover:opacity-100 opacity-0 btn btn-xs btn-square"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
function EditDialog({
  item,
  onSubmit,
}: {
  item: ExternalLink | null;
  onSubmit: (item: ExternalLink) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  useEffect(() => {
    setName(item?.name ?? "");
    setLink(item?.link ?? "");
  }, [item]);
  return (
    <>
      <dialog id="modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="outline-none btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="p-2 space-y-3">
            <div>
              <span className="inline-block mb-1 font-semibold">
                {t("Name")}
              </span>
              <input
                value={name}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                id="name"
                type="text"
                className="w-full input input-bordered"
              />
            </div>
            <div>
              <span className="inline-block mb-1">
                <span className="font-semibold mr-2">{t("Link")}</span>
                <span className="text-sm opacity-50">{t("LinkTip")}</span>
              </span>
              <input
                id="link"
                type="text"
                value={link}
                onInput={(e) => setLink((e.target as HTMLInputElement).value)}
                className="w-full input input-bordered"
              />
            </div>
            <div className="text-right space-x-2">
              <button onClick={closeModal} className="btn">
                {t("Cancel")}
              </button>
              <button
                onClick={() =>
                  onSubmit({ name, link, id: item?.id ?? Date.now() + "" })
                }
                className="btn  btn-primary"
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
