"use client"

import React, {
  useEffect,
  useState,
  memo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"
import { usePathname } from "next/navigation"

import type { SetsState } from "./types"

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
import { getErrorMessage } from "@/lib/utils"
import { getSetsBy } from "@/lib/actions/sets"
import AddSetNavButton from "./AddSetNavButton"
import WorkoutSetsSortable from "./WorkoutSetsSortable"

interface Props {
  workoutId: number
}

const useFetchSetsByWorkout = ({
  workoutId,
}: Props): [
  SetsState,
  Dispatch<SetStateAction<SetsState>>,
  () => boolean,
  () => void,
] => {
  const [workoutSets, setWorkoutSets] = useState<SetsState>({
    isLoading: false,
    error: null,
    data: [],
  })
  const initialSets = useRef<SetsState["data"]>([])

  const isOrderChanged = () => {
    const currentOrder = workoutSets.data
      .map((current) => current.id)
      .join(", ")
    const initialOrder = initialSets.current
      .map((current) => current.id)
      .join(", ")

    return currentOrder !== initialOrder
  }

  const handleReset = () => {
    if (!isOrderChanged()) return
    setWorkoutSets((current) => ({
      ...current,
      data: initialSets.current,
    }))
  }

  useEffect(() => {
    let isMounted = true

    const fetchSets = async () => {
      setWorkoutSets((current) => ({
        ...current,
        error: null,
        isLoading: true,
      }))
      try {
        const sets = await getSetsBy({ workoutId })

        if (isMounted) {
          setWorkoutSets(() => ({ data: sets, isLoading: false, error: null }))
          initialSets.current = sets
        }
      } catch (err) {
        if (isMounted) {
          setWorkoutSets((current) => ({
            ...current,
            isLoading: false,
            error: getErrorMessage(err),
          }))
        }
      }
    }

    fetchSets()

    return () => {
      isMounted = false
    }
  }, [workoutId])

  return [workoutSets, setWorkoutSets, isOrderChanged, handleReset]
}

const WorkoutSets = ({ workoutId }: Props) => {
  const pathname = usePathname()
  const [workoutSets, setWorkoutSets, isOrderChanged, handleReset] =
    useFetchSetsByWorkout({
      workoutId,
    })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirm = () => {
    if (!isOrderChanged()) return
    setIsModalOpen(false)
    console.log(
      "update new Order: ",
      workoutSets.data.map(({ id, name, setOrder }) => ({
        id,
        name,
        setOrder,
      })),
    )
  }

  return (
    <>
      <h3 className="text-lg font-semibold">{`Currently ${workoutSets.data.length} sets in the workout`}</h3>
      <div className="flex gap-4">
        <AddSetNavButton workoutId={workoutId} pathname={pathname}>
          Add new set
        </AddSetNavButton>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!workoutSets.data.length}
              type="button"
              variant="outline"
            >
              Select/Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>List of sets</DialogTitle>
              <DialogDescription>
                List of Drag and drop of the checkboxes list items - can be
                selected/deselected, reordered by drag and drop - submitted the
                changed configuration;
              </DialogDescription>
            </DialogHeader>

            <WorkoutSetsSortable state={[workoutSets, setWorkoutSets]} />

            <DialogFooter className="justify-end gap-4">
              <Button type="button" onClick={handleReset} variant="outline">
                Reset
              </Button>
              <Button type="button" onClick={handleConfirm}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default memo(WorkoutSets)
