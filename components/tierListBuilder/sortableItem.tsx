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
  isBenched?: boolean;
  onRemove?: (id: string) => void;
};

export function Item(props: ItemProps) {
  const handleRemove = () => {
    if (props.onRemove) {
      props.onRemove(props.id);
    }
  };

  if (props.activeItemId === props.id) {
    return (
      <div className=" opacity-10">
        <Image src={props.src} alt={props.id} width={100} height={100} />
      </div>
    );
  }
  if (props.isBenched) {
    return (
      <div className="relative">
        <Image src={props.src} alt={props.id} width={100} height={100} />
        <button
          onClick={handleRemove}
          className="absolute flex -top-1.5 -right-1.5 w-6 h-6 bg-white border border-black rounded-full items-center justify-center shadow-md"
        >
          <svg
            className="w-4 h-4 text-gray-800 dark:text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </button>
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
  isBenched?: boolean;
  onRemove?: (id: string) => void;
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
        isBenched={props.isBenched}
        onRemove={props.onRemove}
      />
    </div>
  );
}
