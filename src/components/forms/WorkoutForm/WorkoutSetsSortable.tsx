"use client"

import React, { type Dispatch, type SetStateAction } from "react"
import { usePathname } from "next/navigation"
import { Eye, SquarePen } from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { SetsState } from "./types"

import IconButton from "@/components/IconButton"
import { cn, paths } from "@/lib/utils"

interface Props {
  state: [SetsState, Dispatch<SetStateAction<SetsState>>]
}

const WorkoutSetsSortable = ({ state }: Props) => {
  const [workoutSets, setWorkoutSets] = state

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setWorkoutSets((current) => {
      const oldIndex = current.data.findIndex((item) => item.id === active.id)
      const newIndex = current.data.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(current.data, oldIndex, newIndex)
      // Optional: update sortOrder if syncing to backend
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      }))

      return {
        ...current,
        data: updatedItems,
      }
    })
  }

  return (
    <div className="mt-4 space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workoutSets.data.map((item) => item.id)} // Only IDs here
          strategy={verticalListSortingStrategy}
        >
          {workoutSets.data.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              workoutId={item.workoutId}
              name={item.name || `Set ${index + 1}`}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableItem({
  id,
  name,
  workoutId,
}: Pick<SetsState["data"][number], "id" | "name" | "workoutId">) {
  const pathname = usePathname()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border border-slate-300 w-full select-none cursor-grab transition-colors duration-200",
        {
          "opacity-75 border-yellow-600 shadow-md": isDragging,
          "hover:opacity-85 hover:border-yellow-600": !isDragging,
        },
      )}
    >
      <span>{name}</span>
      <IconButton
        href={{
          pathname: paths.sets(`${id}/edit`),
          query: {
            workoutId,
            callbackUrl: pathname,
          },
        }}
        title="edit set"
        className="ml-auto z-50"
      >
        <SquarePen />
      </IconButton>
      <IconButton href={paths.sets(id)} title="view set" className="z-50">
        <Eye />
      </IconButton>
    </div>
  )
}

export default WorkoutSetsSortable
