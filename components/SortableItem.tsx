"use client";

import { useState, useTransition } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, BarChart3,Check , X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function SortableItem({
  id,
  link,
}: {
  id: Id<"links">;
  link: Doc<"links">;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link?.title);
  const [editUrl, setEditUrl] = useState(link?.url);
  const [isUpdating,startTransition] = useTransition();
  const updateLink = useMutation(api.lib.links.updateLink);
  const deleteLink = useMutation(api.lib.links.deleteLink);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(link.title);
    setEditUrl(link.url);
  }
  
const handleSave = async () => {
  if (!editTitle?.trim() || !editUrl?.trim()) return;

  startTransition(async () => {
    try {
      // Add https:// if no protocol is specified
      let processedUrl = editUrl;
      if (
        !processedUrl.startsWith("https://") &&
        !processedUrl.startsWith("http://")
      ) {
        processedUrl = `https://${processedUrl}`;
      }

      await updateLink({
        linkId: id,
        title: editTitle.trim(),
        url: processedUrl,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  });
};

  // If no link is provided, return null to avoid rendering
  if (!link) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {!isEditing ? (
        <>
          {/* Left: Drag handle + info */}
          <div className="flex items-center gap-3">
            <GripVertical className="text-gray-400 cursor-grab" />
            <div>
              <p className="text-sm font-medium text-gray-800">{link.title}</p>
              <p className="text-xs text-gray-500">{link.url}</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Analytics Button */}
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={`/dashboard/link/${id}`}>
                <BarChart3 className="w-3.5 h-3.5 text-green-500" />
              </Link>
            </Button>

            {/* Edit Button */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                const isConfirmed = confirm(
                  `Are you sure you want to delete "${link.title}"?\n\nThis action cannot be undone.`
                );
                if (isConfirmed) {
                  deleteLink({ linkId: id });
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </>
      ) : (
 <div className="space-y-2 w-full">
    <Input
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      placeholder="Link title"
      className="font-semibold"
    />

    <Input
      value={editUrl}
      onChange={(e) => setEditUrl(e.target.value)}
      placeholder="https://example.com"
      className="text-sm"
    />

    <div className="flex gap-2 justify-end">
      {/* Cancel Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={isUpdating}
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Save Button */}
      <Button
        size="sm"
        onClick={handleSave}
        disabled={isUpdating || !editTitle.trim() || !editUrl.trim()}
      >
        {isUpdating ? (
          <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Check className="w-4 h-4" />
        )}
      </Button>
    </div>
  </div>      )}
    </div>
  );
}

export default SortableItem;
