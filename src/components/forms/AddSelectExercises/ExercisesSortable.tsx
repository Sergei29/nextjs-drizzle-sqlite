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

import type { AsyncState } from "@/types"
import type { OrderedExercise } from "@/lib/actions/exercises"

import { Checkbox } from "@/components/ui/checkbox"
import IconButton from "@/components/IconButton"
import { cn, paths } from "@/lib/utils"
import { sortExercises, toggleSelectExercise } from "./utils"

interface Props {
  state: [
    AsyncState<OrderedExercise[]>,
    Dispatch<SetStateAction<AsyncState<OrderedExercise[]>>>,
  ]
}

const ExercisesSortable = ({ state }: Props) => {
  const [exercises, setExercises] = state
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    setExercises((current) => {
      if (current.data === null) return current

      const oldIndex = current.data.findIndex((item) => item.id === active.id)
      const newIndex = current.data.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(current.data, oldIndex, newIndex)

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        exerciseOrder: item.exerciseOrder ? index + 1 : undefined,
      }))

      return {
        ...current,
        data: sortExercises(updatedItems),
      }
    })
  }

  const handleItemSelect = (id: number) => {
    setExercises((current) => {
      if (current.data === null) return current

      const updatedData = toggleSelectExercise({
        exercises: current.data,
        id,
      })

      return {
        ...current,
        data: updatedData,
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
          items={exercises.data ? exercises.data.map((item) => item.id) : []} // Only IDs here
          strategy={verticalListSortingStrategy}
        >
          {exercises.data
            ? exercises.data.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  isSelected={item.exerciseOrder !== undefined}
                  handleSelect={handleItemSelect}
                />
              ))
            : null}
        </SortableContext>
      </DndContext>
    </div>
  )
}

type SortableItemProps = Pick<OrderedExercise, "id" | "name"> & {
  handleSelect: (id: number) => void
  isSelected: boolean
}

function SortableItem({
  id,
  name,
  isSelected,
  handleSelect,
}: SortableItemProps) {
  const pathname = usePathname()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isSelected })

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
      <span>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => {
            handleSelect(id)
          }}
        />
      </span>
      <span>{name}</span>
      <IconButton
        href={{
          pathname: paths.exercises(`${id}/edit`),
          query: {
            exerciseId: id,
            callbackUrl: pathname,
          },
        }}
        title="edit set"
        className="ml-auto z-50"
      >
        <SquarePen />
      </IconButton>
      <IconButton href={paths.exercises(id)} title="view set" className="z-50">
        <Eye />
      </IconButton>
    </div>
  )
}

export default ExercisesSortable
