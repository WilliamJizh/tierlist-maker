"use client";
import React, { useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

type ItemProps = {
  id: string;
  src: string;
  isOverlay?: boolean;
  isDragging?: boolean;
  activeItemId?: string;
};

export function Item(props: ItemProps) {
  if (props.activeItemId === props.id) {
    return (
      <div className=" opacity-10">
        <Image src={props.src} alt={props.id} width={100} height={100} />
      </div>
    );
  }
  return (
    <div>
      <Image src={props.src} alt={props.id} width={100} height={100} />
    </div>
  );
}

type SortableItemProps = {
  id: string;
  src: string;
  activeItemId: string;
};

export default function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item
        id={props.id}
        src={props.src}
        isDragging={isDragging}
        activeItemId={props.activeItemId}
      />
    </div>
  );
}
