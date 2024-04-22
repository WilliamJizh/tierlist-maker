'use client'
import React from "react";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";
import { DNDItem } from "@/components/tierList";

type ContainerProps = {
  id: UniqueIdentifier;
  title: string;
  items: DNDItem[];
  activeItemId: string;
  setTitle: (title: string, id:string) => void;
  removeContainer: (id: string) => void;
  containerMoveUp: (id: string) => void;
  containerMoveDown: (id: string) => void;
};


export default function Container(props: ContainerProps) {
  const { id, items, title, activeItemId, setTitle} = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  if(id === 'bench'){
    return (
      <div ref={setNodeRef} className=" flex bg-zinc-500 gap-2 p-4 rounded flex-wrap min-h-36">
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
    <div className="flex bg-zinc-500">
      <SortableContext
        id={id.toString()}
        items={items}
        strategy={horizontalListSortingStrategy}
      >
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent the Enter key from creating a new line
            }
          }}
          contentEditable="true"
          onChange={(e) => setTitle(e.target.value, id.toString())}
          className="flex items-center justify-center p-4 bg-zinc-500 text-xl font-bold text-center w-1/3 resize-none text-wrap overflow-clip"
        >
          {title}
        </div>
        <div
          ref={setNodeRef}
          className="flex  gap-2 p-4 rounded flex-wrap min-h-36 w-full items-center"
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

            <button onClick={() => props.containerMoveUp(id.toString())} >Up</button>
            <button onClick={()=> props.containerMoveDown(id.toString())} >Down</button>
    </div>
  );
}
