"use client";

import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import type {
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Container from "@/components/container";
import { Item } from "@/components/sortableItem";
import { v4 as uuidv4 } from "uuid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button } from "./ui/button";
import { ImageUpload } from "./imageCropper";
import html2canvas from "html2canvas";
import { ModeToggle } from "./ui/modeToggleButton";
import { DrawerTab } from "./ui/drawertab";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { direction } from "html2canvas/dist/types/css/property-descriptors/direction";

export type DNDContainer = {
  id: UniqueIdentifier;
  title: string;
  items: DNDItem[];
};

export type DNDItem = {
  id: UniqueIdentifier;
  title: string;
  src: string;
};

type TierListProps = {
  starterItems?: DNDContainer[];
};

const TierList = (props: TierListProps) => {
  // Maintain state for each container and the items they contain
  const [parent] = useAutoAnimate();
  const [benchDrawer] = useAutoAnimate();
  const tierListRef = useRef(null);
  const [title, setTitle] = useState("New Tier List");
  const [isBenchVisible, setIsBenchVisible] = useState(false);

  const [containers, setContainers] = useState<DNDContainer[]>(
    props.starterItems || [
      {
        id: "container1",
        title: "A",
        items: [],
      },
      {
        id: "container2",
        title: "B",
        items: [],
      },
      {
        id: "container3",
        title: "C",
        items: [],
      },
      {
        id: "container4",
        title: "D",
        items: [],
      },
      {
        id: "bench",
        title: "Bench",
        items: [],
      },
    ]
  );

  useEffect(() => {
    if (parent.current && benchDrawer.current) {
      const adjustPadding = isBenchVisible
        ? benchDrawer.current.offsetHeight
        : 0;
      parent.current.style.paddingBottom = `${adjustPadding}px`;
    }
  }, [isBenchVisible]);

  const toggleBenchVisibility = () => {
    setIsBenchVisible(!isBenchVisible);
  };

  const addContainer = (id?: string, direction?: string) => {
    const benchContainerIndex = containers.findIndex(
      (container) => container.id === "bench"
    );

    const newContainerItems = {
      id: uuidv4(),
      title: `New Tier`,
      items: [],
    };

    if (direction === "above" && id) {
      const containerIndex = containers.findIndex(
        (container) => container.id === id
      );
      setContainers((currentItems) => [
        ...currentItems.slice(0, containerIndex),
        newContainerItems,
        ...currentItems.slice(containerIndex),
      ]);
    } else if (direction === "below" && id) {
      const containerIndex = containers.findIndex(
        (container) => container.id === id
      );
      setContainers((currentItems) => [
        ...currentItems.slice(0, containerIndex + 1),
        newContainerItems,
        ...currentItems.slice(containerIndex + 1),
      ]);
    } else {
      // add the new container before the bench
      setContainers((currentItems) => [
        ...currentItems.slice(0, benchContainerIndex),
        newContainerItems,
        ...currentItems.slice(benchContainerIndex),
      ]);
    }
  };

  const addItem = (image: string) => {
    setContainers((currentItems) => {
      const containerIndex = currentItems.findIndex(
        (container) => container.id === "bench"
      );

      if (containerIndex === -1) {
        return currentItems;
      }

      const newItems = [...currentItems];
      const container = newItems[containerIndex];

      newItems[containerIndex] = {
        ...container,
        items: [
          ...container.items,
          {
            id: uuidv4(),
            title: `Item ${container.items.length + 1}`,
            src: image,
          },
        ],
      };

      return newItems;
    });
    setIsBenchVisible(true);
  };

  const setContainerTitle = (title: string, id: string) => {
    setContainers((currentItems) => {
      const containerIndex = currentItems.findIndex(
        (container) => container.id === id
      );

      if (containerIndex === -1) {
        return currentItems;
      }

      const newItems = [...currentItems];
      const container = newItems[containerIndex];

      newItems[containerIndex] = {
        ...container,
        title,
      };

      return newItems;
    });
  };

  const containerMoveUp = (id: string) => {
    const containerIndex = containers.findIndex(
      (container) => container.id === id
    );

    if (containerIndex <= 0) {
      return;
    }

    setContainers((currentItems) => {
      const newItems = [...currentItems];
      const [container] = newItems.splice(containerIndex, 1);
      newItems.splice(containerIndex - 1, 0, container);

      return newItems;
    });
  };

  const containerMoveDown = (id: string) => {
    const containerIndex = containers.findIndex(
      (container) => container.id === id
    );

    if (containerIndex === -1 || containerIndex >= containers.length - 1) {
      return;
    }

    setContainers((currentItems) => {
      const newItems = [...currentItems];
      const [container] = newItems.splice(containerIndex, 1);
      newItems.splice(containerIndex + 1, 0, container);

      return newItems;
    });
  };

  const removeContainer = (id: string) => {
    setContainers((currentItems) => {
      return currentItems.filter((container) => container.id !== id);
    });
  };

  // Use the defined sensors for drag and drop operation
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // Require mouse to move 5px to start dragging, this allow onClick to be triggered on click
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // Require mouse to move 5px to start dragging, this allow onClick to be triggered on click
        tolerance: 5,
        // Require to press for 100ms to start dragging, this can reduce the chance of dragging accidentally due to page scroll
        delay: 100,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeItemContent, setActiveItemContent] = useState<
    DNDItem | undefined
  >();

  // Ref to store the ID of the last container that was hovered over during a drag
  const lastOverId = useRef<UniqueIdentifier | undefined>(undefined);

  // Ref to track if an item was just moved to a new container
  const recentlyMovedToNewContainer = useRef(false);

  // Function to find which container an item belongs to
  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      // if the id is a container id itself
      if (containers.some((item) => item.id === id)) return id;

      // find the container by looking into each of them
      return containers.find((container) =>
        container.items.some((item) => item.id === id)
      )?.id;
    },
    [containers]
  );

  // Ref to store the state of items before a drag operation begins
  const itemsBeforeDrag = useRef<null | DNDContainer[]>(null);

  // Function called when a drag operation begins
  const handleDragStart = useCallback(
    // ({ active }: DragStartEvent) => {
    //   itemsBeforeDrag.current = {
    //     container1: [...items.container1],
    //     container2: [...items.container2],
    //     container3: [...items.container3],
    //     container4: [...items.container4],
    //   };
    //   setActiveId(active.id);
    // },
    // [items],
    ({ active }: DragStartEvent) => {
      // Store the current state of items
      itemsBeforeDrag.current = { ...containers };
      // Set the active (dragged) item id
      const activeItem = containers
        .find((container) =>
          container.items.some((item) => item.id === active.id)
        )
        ?.items.find((item) => item.id === active.id);
      setActiveItemContent(activeItem);
      console.log("activeItem", activeItem);
    },
    [containers]
  );

  // Function called when an item is dragged over another container
  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      console.log("over", over);
      if (!over || containers.some((container) => container.id === active.id)) {
        return;
      }

      const activeId = active.id;
      const overId = over.id;

      const findContainer = (id) => {
        // if the id is a container id itself
        const container = containers.find((item) => item.id === id);
        if (container) return container;
        // find the container by looking into each of them
        return containers.find((container) =>
          container.items.some((item) => item.id === id)
        );
      };

      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);
      console.log("activeContainer", activeContainer);
      console.log("overContainer", overContainer);

      if (
        !overContainer ||
        !activeContainer ||
        activeContainer.id === overContainer.id
      ) {
        console.log("return");
        return;
      }

      setContainers((currentItems) => {
        const newItems = currentItems.map((container) => {
          if (container.id === activeContainer.id) {
            // Remove the item from the current active container
            return {
              ...container,
              items: container.items.filter((item) => item.id !== activeId),
            };
          }
          console.log("container.id", container.id);
          console.log("overContainer.id", overContainer.id);
          if (container.id === overContainer.id) {
            console.log("container.id === overContainer.id");
            // Add the item to the new container
            const activeItem = activeContainer.items.find(
              (item) => item.id === activeId
            );
            console.log("activeItem", activeItem);
            const overItemIndex = container.items.findIndex(
              (item) => item.id === overId
            );
            console.log("overItemIndex", overItemIndex);
            let newContainerItems = [...container.items];

            if (overItemIndex >= 0) {
              // Decide the position based on the over item index and possibly the cursor position
              newContainerItems.splice(overItemIndex + 1, 0, activeItem);
            } else {
              // Just add to the end if no 'over' item index could be found
              newContainerItems.push(activeItem);
            }

            return { ...container, items: newContainerItems };
          }
          return container; // No change for other containers
        });

        return newItems;
      });

      recentlyMovedToNewContainer.current = true;
    },
    [containers]
  );

  // Function called when a drag operation ends
  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over) {
        setActiveItemContent(undefined);
        return;
      }

      const activeContainerIndex = containers.findIndex((container) =>
        container.items.some((item) => item.id === active.id)
      );
      const overContainerIndex = containers.findIndex((container) =>
        container.items.some((item) => item.id === over.id)
      );

      if (activeContainerIndex === -1 || overContainerIndex === -1) {
        setActiveItemContent(undefined);
        return;
      }

      const activeItems = containers[activeContainerIndex].items;
      const overItems = containers[overContainerIndex].items;
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over.id);

      if (
        activeContainerIndex === overContainerIndex &&
        activeIndex === overIndex
      ) {
        setActiveItemContent(undefined);
        return;
      }

      const newItems = [...containers];

      const sourceResult = arrayMove(activeItems, activeIndex, overIndex);
      newItems[activeContainerIndex].items = sourceResult;

      setContainers(newItems);
      setActiveItemContent(undefined);
    },
    [containers]
  );

  // Function called when a drag operation is cancelled
  const onDragCancel = useCallback(() => {
    if (!itemsBeforeDrag.current) {
      return;
    }
    setContainers(itemsBeforeDrag.current);
    itemsBeforeDrag.current = null;
    setActiveItemContent(undefined);
  }, []);

  /**
   * Custom collision detection strategy optimized for multiple containers
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (
        activeItemContent &&
        containers.some((container) => container.id === activeItemContent.id)
      ) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in containers
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId != null) {
        if (containers.some((container) => container.id === overId)) {
          const containerItems = containers
            .find((container) => container.id === overId)
            ?.items.map((item) => item.id);

          // Return the container if it has no items (columns 'D', 'E', 'F'
          if (!containerItems) return [{ id: overId }];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeItemContent?.id;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeItemContent, containers]
  );

  // useEffect hook called after a drag operation, to clear the "just moved" status
  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [containers]);

  const takeScreenshot = () => {
    const parent = tierListRef.current;
    if (!parent) return;

    // Create a clone of the grid to manipulate
    const clone = parent.cloneNode(true);
    clone.classList.add("bg-background");

    // Add title element at the top of the clone
    const titleText = document.createElement("div");
    titleText.textContent = title; // Set the title text here
    titleText.className = "text-center font-bold text-3xl mb-4 text-pretty"; // Tailwind classes for styling
    clone.insertBefore(titleText, clone.firstChild); // Insert title before the first child of the clone

    // Remove the 'bench' container from the clone
    const benchContainer = clone.querySelector("#bench");
    const benchDrawer = clone.querySelector("#bench-drawer");
    if (benchContainer) {
      benchContainer.remove();
    }

    if (benchDrawer) {
      benchDrawer.remove();
    }

    // remove all setting buttons from the clone
    const settingButtons = clone.querySelectorAll(".setting-button");
    settingButtons.forEach((button) => button.remove());
    console.log(clone);
    // Append the clone to the body to make it part of the document temporarily
    document.body.appendChild(clone);

    // Use html2canvas to take a screenshot of the clone
    html2canvas(clone, { scale: 1 }).then((canvas) => {
      // You can do whatever you want with the canvas here.
      // For example, download it as an image:
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${title}.png`;
      link.click();

      // Clean up: remove the clone from the body
      document.body.removeChild(clone);
    });
  };

  // Render the app, including the DnD context and all containers and items
  return (
    <>
      <TooltipProvider>
        <div className="flex gap-2 justify-end p-2 pr-4 fixed top-0 w-full backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b z-10">
          <div className="flex-grow items-center pl-4 inline-flex h-12">
            <textarea
              contentEditable="true"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="resize-none text-wrap text-lg font-bold w-1/3 h-8 overflow-scroll bg-transparent"
            >
              {title}
            </textarea>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={takeScreenshot}
                variant="outline"
                className="flex gap-2 p-2"
              >
                <svg
                  className="w-full h-full text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7V5h8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p>Save List</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save the current tierlist as image</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={addContainer}
                variant="outline"
                className="flex gap-2 p-2"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857ZM18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p>Add Tier</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a tier to the bottom</p>
            </TooltipContent>
          </Tooltip>

          <ImageUpload onUpload={addItem} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={toggleBenchVisibility}
                className="flex p-2 gap-2"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="4"
                    d="M6 12h.01m6 0h.01m5.99 0h.01"
                  />
                </svg>
                <p>Bench</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show/Hide bench</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="p-4 mt-16 " ref={tierListRef}>
          {/* <div className="header">
        <h1 className="title">Drag and Drop Example</h1>
      </div> */}
          <DndContext
            sensors={sensors}
            // collisionDetection={closestCenter}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={onDragCancel}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            // When overlay is not used, items can be drag and scroll to bottom infinitely,
            // restrictToWindowEdges can solve some the issue.
            // However, since the draggable item is bound inside window, it will sometimes prevent
            // dragging of tall items to top of container. Enabling this also won't
            // solve infinite scroll on non-body container (e.g. overflow-x on a child div)
            // modifiers={[restrictToWindowEdges]}
          >
            {/* Main content that moves based on drawer visibility */}
            <div
              className={`grid gap-2${isBenchVisible ? " mb-56" : ""}`}
              ref={parent}
            >
              {containers.map((container) => {
                if (container.id === "bench") return null;
                return (
                  <Container
                    key={container.id}
                    id={container.id}
                    items={container.items}
                    title={container.title}
                    activeItemId={activeItemContent?.id.toString() || ""}
                    setTitle={setContainerTitle}
                    removeContainer={removeContainer}
                    containerMoveUp={containerMoveUp}
                    containerMoveDown={containerMoveDown}
                    addContainer={addContainer}
                  />
                );
              })}
            </div>

            {/* Drawer that pushes content */}
            <div
              ref={benchDrawer}
              className={`fixed border-t bottom-0 left-0 w-full p-4 pt-3 z-50 bg-background  transition-transform, duration-150 transform ${
                isBenchVisible ? "translate-y-0" : "translate-y-full"
              }`}
              id="bench-drawer"
            >
              <div className="w-full flex justify-between items-center pb-4">
                <p className="text-pretty text-xl font-bold ">Bench</p>
                <Button
                  onClick={() => setIsBenchVisible(false)}
                  variant="outline"
                  className="px-2 w-10 h-10"
                >
                  <svg
                    className="text-gray-800 dark:text-white"
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
                      strokeWidth="3"
                      d="M6 18L17.94 6M18 18L6.06 6"
                    />
                  </svg>
                </Button>
              </div>
              <Container
                key={"bench"}
                id={"bench"}
                items={
                  containers.find((container) => container.id === "bench")
                    ?.items || []
                }
                title={"Bench"}
                activeItemId={activeItemContent?.id.toString() || ""}
                setTitle={setContainerTitle}
                removeContainer={removeContainer}
                containerMoveUp={containerMoveUp}
                containerMoveDown={containerMoveDown}
              />
            </div>

            {/* Use CSS.Translate.toString(transform) in `Item` style if overlay is disabled */}
            <DragOverlay>
              {activeItemContent ? (
                <Item
                  id={activeItemContent.id.toString()}
                  src={activeItemContent.src}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </TooltipProvider>
    </>
  );
};

export default TierList;
