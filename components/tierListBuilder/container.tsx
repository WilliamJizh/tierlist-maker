"use client";
import { DNDItem } from "@/components/tierListBuilder/tierList";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import SortableItem from "./sortableItem";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ContainerProps = {
  id: UniqueIdentifier;
  title: string;
  items: DNDItem[];
  activeItemId: string;
  setTitle: (title: string, id: string) => void;
  removeContainer: (id: string) => void;
  containerMoveUp: (id: string) => void;
  containerMoveDown: (id: string) => void;
  addContainer?: (id?: string, direction?: string) => void;
  onRemoveItem?: (id: string) => void;
};

export default function Container(props: ContainerProps) {
  const { id, items, title, activeItemId, setTitle } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  if (id === "bench") {
    return (
      <div
        ref={setNodeRef}
        id="bench"
        className=" flex max-h-64 min-h-36 flex-wrap gap-2 overflow-auto rounded-lg  border border-zinc-300  bg-background p-4"
      >
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id.toString()}
            src={item.src}
            activeItemId={activeItemId}
            isBenched={true}
            onRemove={props.onRemoveItem}
          />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <div className="flex min-h-[116px]">
        <CardTitle>
          <div className="m-auto flex h-full w-24 flex-wrap items-center justify-center border-r p-2">
            <div
              suppressContentEditableWarning
              contentEditable
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent the Enter key from creating a new line
                }
              }}
              onBlur={(e)=>setTitle(e.currentTarget.textContent || "", id.toString())}
              className="w-full resize-none text-wrap text-center text-lg "
            >
              <p>{title}</p>
            </div>
          </div>
        </CardTitle>
        <SortableContext
          id={id.toString()}
          items={items}
          strategy={horizontalListSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className="flex w-full flex-wrap content-start gap-2 p-2 px-2 pl-4"
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id.toString()}
                src={item.src}
                activeItemId={activeItemId}
              />
            ))}
          </div>
        </SortableContext>

        <div className="setting-button my-auto pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" h-10 w-10 p-2">
                <svg
                  className="h-[40px] w-[40px] text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                onClick={() => props.containerMoveUp(id.toString())}
              >
                Up
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => props.containerMoveDown(id.toString())}
              >
                Down
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() =>
                  props.addContainer &&
                  props.addContainer(id.toString(), "above")
                }
              >
                Add Tier Above
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() =>
                  props.addContainer &&
                  props.addContainer(id.toString(), "below")
                }
              >
                Add Tier Below
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => props.removeContainer(id.toString())}
              >
                <p className=" text-red-600">Remove</p>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
