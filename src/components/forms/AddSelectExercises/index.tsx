"use client"

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"

import type { AsyncState } from "@/types"
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
import { getAllExercisesWithOptionalSetInfo } from "@/lib/actions/exercises"
import { getErrorMessage } from "@/lib/utils"
import AddNewExerciseButton from "./AddNewExerciseButton"

interface Props {
  setId?: number
  title?: ReactNode
  className?: string
}

const useSetExercises = (setId?: number) => {
  const [state, setState] = useState<
    AsyncState<Awaited<ReturnType<typeof getAllExercisesWithOptionalSetInfo>>>
  >({
    data: null,
    isLoading: false,
    error: null,
  })
  const mountedRef = useRef(false)

  const fetchExercises = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true }))
    try {
      const data = await getAllExercisesWithOptionalSetInfo(setId)
      if (!mountedRef.current) return
      setState({ data, isLoading: false, error: null })
    } catch (error) {
      if (!mountedRef.current) return
      setState((current) => ({
        ...current,
        isLoading: false,
        error: getErrorMessage(error),
      }))
    }
  }, [setId])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchExercises()
  }, [fetchExercises])

  return { ...state, refetch: fetchExercises }
}

const AddSelectExercises = ({ setId, title, className }: Props) => {
  const pathname = usePathname()
  const { data: setExercises } = useSetExercises(setId)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {title !== null && title !== undefined ? (
        title
      ) : (
        <h3 className="font-semibold text-sm">
          {`${setExercises?.length || 0} exercises in this set`}
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

          <div>list of exercises</div>

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
              onClick={() => {
                console.log("Resetting exercises")
              }}
              variant="outline"
            >
              Reset
            </Button>
            <Button
              type="button"
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
