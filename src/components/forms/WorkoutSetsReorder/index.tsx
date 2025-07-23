"use client"

import React, {
  useEffect,
  useState,
  memo,
  useRef,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"

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
import { getSetsBy, reorderSets } from "@/lib/actions/sets"
import AddSetNavButton from "./AddSetNavButton"
import WorkoutSetsSortable from "./WorkoutSetsSortable"

interface Props {
  workoutId: number
  renderTitle?: (sets: SetsState["data"]) => ReactNode
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

const WorkoutSetsReorder = ({ workoutId, renderTitle }: Props) => {
  const pathname = usePathname()
  const [workoutSets, setWorkoutSets, isOrderChanged, handleReset] =
    useFetchSetsByWorkout({
      workoutId,
    })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirm = async () => {
    if (!isOrderChanged()) return

    const response = await reorderSets({
      reorderedSets: workoutSets.data.map(({ id, setOrder, workoutId }) => ({
        id,
        setOrder,
        workoutId,
      })),
    })

    if (response.success) {
      toast("Sets reordered")
      setIsModalOpen(false)
    } else {
      toast("Error reordering the sets", {
        description: response.errors[0].root,
      })
    }
  }

  return (
    <>
      {renderTitle && renderTitle(workoutSets.data)}
      <div className="flex gap-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              Change sets
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
              <AddSetNavButton
                workoutId={workoutId}
                pathname={pathname}
                className="mr-auto"
              >
                <Plus />
                new set
              </AddSetNavButton>

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

export default memo(WorkoutSetsReorder)
