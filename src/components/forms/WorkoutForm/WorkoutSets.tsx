"use client"

import React, { useEffect, useState, memo } from "react"
import { usePathname } from "next/navigation"
import { Eye, SquarePen } from "lucide-react"

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
import IconButton from "@/components/IconButton"
import { getErrorMessage, paths } from "@/lib/utils"
import { getSetsBy } from "@/lib/actions/sets"
import AddSetNavButton from "./AddSetNavButton"

interface State {
  isLoading: boolean
  error: null | string
  data: Awaited<ReturnType<typeof getSetsBy>>
}

interface Props {
  workoutId: number
}

const useFetchSetsByWorkout = ({ workoutId }: Props) => {
  const [workoutSets, setWorkoutSets] = useState<State>({
    isLoading: false,
    error: null,
    data: [],
  })

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

  return workoutSets
}

const WorkoutSets = ({ workoutId }: Props) => {
  const pathname = usePathname()
  const sets = useFetchSetsByWorkout({ workoutId })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirm = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <h3 className="text-lg font-semibold">{`Currently ${sets.data.length} sets in the workout`}</h3>
      <div className="flex gap-4">
        <AddSetNavButton workoutId={workoutId} pathname={pathname}>
          Add new set
        </AddSetNavButton>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={!sets.data.length}
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
            <div>
              <ul className="flex flex-col gap-2 pl-8">
                {sets.data.map((set) => {
                  return (
                    <li
                      key={set.id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-300 w-full"
                    >
                      <span>{set.name}</span>
                      <IconButton
                        href={{
                          pathname: paths.sets(`${set.id}/edit`),
                          query: {
                            workoutId,
                            callbackUrl: pathname,
                          },
                        }}
                        title="edit set"
                        className="ml-auto"
                      >
                        <SquarePen />
                      </IconButton>
                      <IconButton href={paths.sets(set.id)} title="view set">
                        <Eye />
                      </IconButton>
                    </li>
                  )
                })}
              </ul>
            </div>
            <DialogFooter className="justify-end">
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
