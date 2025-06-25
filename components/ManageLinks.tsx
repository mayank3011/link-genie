"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "./ui/button";
import SortableItem from "./SortableItem";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

function ManageLinks({
  preloadedLinks,
}: {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId>;
}) {
  const links = usePreloadedQuery(preloadedLinks);
  const updateLinkOrder = useMutation(api.lib.links.updateLinkOrder);

  // Store item order locally for UX
  const [items, setItems] = useState(links.map((link) => link._id));

  // Setup sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reorder logic
  function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  // Don't do anything if dropped in the same position or outside a valid drop zone
  if (!over || active.id === over.id) return;

  setItems((items) => {
    const oldIndex = items.indexOf(active.id as Id<"links">);
    const newIndex = items.indexOf(over.id as Id<"links">);

    // Avoid invalid indices
    if (oldIndex === -1 || newIndex === -1) return items;

    const newItems = arrayMove(items, oldIndex, newIndex);

    // Update the links order in the DB
    updateLinkOrder({ linkIds: newItems });

    return newItems;
  });
}

  // Fast lookup for link data
  const linkMap = useMemo(() => {
    return Object.fromEntries(links.map((link) => [link._id, link]));
  }, [links]);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((id) => {
              const link = linkMap[id];
              if (!link) return null;
              return <SortableItem key={id} id={id} link={link} />;
            })}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        className="w-full border-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-700 hover:text-purple-50 transition-all duration-200 mt-4"
        asChild
      >
        <Link href="/dashboard/new-link">
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Link>
      </Button>
    </>
  );
}

export default ManageLinks;
