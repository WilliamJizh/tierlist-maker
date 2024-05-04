"use client";

import Container from "@/components/tierListBuilder/container";
import { Item } from "@/components/tierListBuilder/sortableItem";
import type {
  CollisionDetection,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  closestCenter,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { ImageUpload } from "./imageCropper";
import { PublishTierList } from "./tierListPublish";
import { TitleDialog } from "./titleEdit";


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
  title?: string;
  starterItems?: DNDContainer[];
  success?: boolean;
};

const TierList = (props: TierListProps) => {
  // Maintain state for each container and the items they contain
  const { toast } = useToast();
  const [parent] = useAutoAnimate();
  const [benchDrawer] = useAutoAnimate();
  const tierListRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(props.title || "New Tier List");
  const [isBenchVisible, setIsBenchVisible] = useState(false);
  const router = useRouter();
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
    if (props.success) {
      toast({
        title: "Tierlist published",
        description: "Your tierlist has been successfully published",
      });
    }
  }, []);

 
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

  const removeItem = (id: string) => {
    setContainers((currentItems) => {
      return currentItems.map((container) => {
        return {
          ...container,
          items: container.items.filter((item) => item.id !== id),
        };
      });
    });
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
    },
    [containers]
  );

  // Function called when an item is dragged over another container
  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!over || containers.some((container) => container.id === active.id)) {
        return;
      }

      const activeId = active.id;
      const overId = over.id;

      const findContainer = (id: string) => {
        // if the id is a container id itself
        const container = containers.find((item) => item.id === id);
        if (container) return container;
        // find the container by looking into each of them
        return containers.find((container) =>
          container.items.some((item) => item.id === id)
        );
      };

      const activeContainer = findContainer(activeId.toString());
      const overContainer = findContainer(overId.toString());

      if (
        !overContainer ||
        !activeContainer ||
        activeContainer.id === overContainer.id
      ) {
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

          if (container.id === overContainer.id) {
            // Add the item to the new container
            const activeItem = activeContainer.items.find(
              (item) => item.id === activeId
            );
            if (!activeItem) return container;
            const overItemIndex = container.items.findIndex(
              (item) => item.id === overId
            );
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
    ({ active, over }: { active: any; over: any }) => {
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

  const createScreenShotHTML = () => {
    const parent = tierListRef.current;
    if (!parent) return;

    // Create a clone of the grid to manipulate
    const clone: HTMLElement = parent.cloneNode(true) as HTMLElement;
    clone.classList.add("bg-background");
    clone.classList.add("h-fit");
    

    // Add styles to keep the clone invisible
    clone.style.position = "absolute";
    clone.style.left = "-9999px"; // Move the clone far off-screen
    clone.style.top = "-9999px";

    clone.style.width = "1200px"; // Set the width

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

    //remove extra bottom paddings
    if (isBenchVisible){
      const parentBackground = clone.querySelector(".parent-background");
      parentBackground?.classList.remove("mb-56");
    }

    // remove all setting buttons from the clone
    const settingButtons = clone.querySelectorAll(".setting-button");
    settingButtons.forEach((button) => button.remove());

    return clone;
  };

  const takeScreenshot = () => {
    const clone = createScreenShotHTML();
    if (!clone) {
      alert("Failed to take screenshot");
      return;
    }
    // Append the clone to the body to make it part of the document temporarily
    document.body.appendChild(clone);

    // Use html2canvas to take a screenshot of the clone
    html2canvas(clone, { scale: 5, height: clone.offsetHeight - 1 }).then(
      (canvas) => {
        // You can do whatever you want with the canvas here.
        // For example, download it as an image:
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${title}.png`;
        link.click();

        // Clean up: remove the clone from the body
        document.body.removeChild(clone);
      }
    );
  };

  const generateScreenshotImage = async () => {
    const clone = createScreenShotHTML();
    if (!clone) {
      toast({
        title: "Failed to take screenshot",
        description: "Please try again.",
      })
      return "";
    }
    // Append the clone to the body to make it part of the document temporarily
    document.body.appendChild(clone);

    // Use html2canvas to take a screenshot of the clone
    const canvas = await html2canvas(clone, {
      scale: 1,
      height: clone.offsetHeight - 1,
    });

    // Clean up: remove the clone from the body
    document.body.removeChild(clone);

    return canvas.toDataURL("image/png", 0.5);
  };

  const handleHomeClick = () => {
    // navigate to home
    router.prefetch("/");
    router.push("/");
  };

  // Render the app, including the DnD context and all containers and items
  return (
    <>
      <TooltipProvider>
        <div className="flex gap-2 items-center justify-end p-2 py-4 pr-4 sticky top-0 z-40 w-full min-w-max backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b ">
          <div className="flex-grow  gap-2 items-center pl-4 inline-flex">
            <Button
              onClick={handleHomeClick}
              variant="outline"
              className="w-10 h-10 flex p-2"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </Button>
            <p className=" font-bold text-xl max-w-64 max-h-12 overflow-x-auto">
              {title}
            </p>
            <TitleDialog submitTitle={setTitle} title={title} />
            <PublishTierList
              title={title}
              content={containers}
              getTierlistCoverImage={generateScreenshotImage}
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={takeScreenshot} variant="outline">
                <p>Save To Image</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save the current tierlist as image</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => addContainer()} variant="outline">
                <p>New Tier</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a tier to the bottom</p>
            </TooltipContent>
          </Tooltip>

          <ImageUpload onUpload={addItem} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={toggleBenchVisibility}>
                <p>Bench</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show/Hide bench</p>
            </TooltipContent>
          </Tooltip>
        </div>


        <div className="p-4 " ref={tierListRef}>

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
              className={`parent-background grid gap-2${isBenchVisible ? " mb-56" : ""}`}
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
                    onRemoveItem={removeItem}
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
                onRemoveItem={removeItem}
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
