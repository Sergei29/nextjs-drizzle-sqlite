"use client"

import React, { useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AddNewExerciseButton from "./AddNewExerciseButton"
import ExercisesSortable from "./ExercisesSortable"
import useSetExercises from "./useSetExercises"

interface Props {
  setId?: number
  title?: ReactNode
  className?: string
}

const AddSelectExercises = ({ setId, title, className }: Props) => {
  const pathname = usePathname()
  const [exercises, setExercises, handleResetExercises, hasChanged] =
    useSetExercises(setId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const exerciseCount = exercises.data
    ? exercises.data.filter((item) => item.exerciseOrder !== undefined).length
    : 0

  return (
    <>
      {title !== null && title !== undefined ? (
        title
      ) : (
        <h3 className="font-semibold text-sm">
          {`${exerciseCount} exercises in this set`}
        </h3>
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className={className}>
            add/edit exercises
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List of exercises</DialogTitle>
            <DialogDescription>
              List of Drag and drop of the checkboxes list items - can be
              selected/deselected, reordered by drag and drop - submitted the
              changed configuration;
            </DialogDescription>
          </DialogHeader>

          <ExercisesSortable state={[exercises, setExercises]} />

          <DialogFooter className="justify-end gap-4">
            <AddNewExerciseButton
              setId={setId}
              pathname={pathname}
              className="mr-auto"
            >
              <Plus />
              new exercise
            </AddNewExerciseButton>

            <Button
              type="button"
              disabled={!hasChanged}
              onClick={handleResetExercises}
              variant="outline"
            >
              Reset
            </Button>
            <Button
              type="button"
              disabled={!hasChanged}
              onClick={() => {
                console.log("confirmed exercises")
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddSelectExercises
