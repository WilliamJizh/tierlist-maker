"use client";
import React from "react";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";
import { DNDItem } from "@/components/tierList";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
        className=" flex bg-background border border-zinc-300 rounded-lg gap-2 p-4  flex-wrap min-h-36  max-h-64 overflow-scroll"
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
    );
  }

  return (
    <Card>
      <div className="flex min-h-[116px]">
        <CardTitle>
          <div className="flex justify-center items-center w-24 m-auto h-full flex-wrap border-r p-2">
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent the Enter key from creating a new line
                }
              }}
              contentEditable="true"
              onChange={(e) => setTitle(e.target.value, id.toString())}
              className="resize-none text-wrap text-lg w-full text-center"
            >
              {title}
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
            className="flex flex-wrap gap-2 px-6 w-full content-start p-2"
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

        <div className="pr-2 my-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="setting-button p-2 w-10 h-10"
              >
                <svg
                  className="w-[40px] h-[40px] text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
                onClick={() => props.removeContainer(id.toString())}
              >
                Remove
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
