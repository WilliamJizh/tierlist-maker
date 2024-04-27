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
        className=" flex bg-transparent border border-zinc-300 rounded-lg gap-2 p-4  flex-wrap min-h-36"
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
              <Button variant="outline">
                <svg
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                  {...props}
                >
                  <path d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.6 17.8c-8.8 2.8-18.6.3-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4c-1.1-8.4-1.7-16.9-1.7-25.5s.6-17.1 1.7-25.4l-43.3-39.4c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z" />
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
