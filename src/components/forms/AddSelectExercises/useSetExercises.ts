import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"

import type { AsyncState } from "@/types"
import {
  getAllExercisesWithOptionalOrder,
  type OrderedExercise,
} from "@/lib/actions/exercises"
import { getErrorMessage } from "@/lib/utils"
import { sortExercises } from "./utils"

const useSetExercises = (
  setId?: number,
): [
  AsyncState<OrderedExercise[]>,
  Dispatch<SetStateAction<AsyncState<OrderedExercise[]>>>,
  () => void,
  boolean,
] => {
  const [exercises, setExercises] = useState<AsyncState<OrderedExercise[]>>({
    data: null,
    isLoading: false,
    error: null,
  })
  const mountedRef = useRef(false)
  const initialExercises = useRef<OrderedExercise[]>([])

  const hasChanged = () => {
    if (exercises.data === null) return false
    // Compare current exercises with initialExercises
    const currentSelected = exercises.data.filter(
      (exercise) => exercise.exerciseOrder !== undefined,
    )
    const initialSelected = initialExercises.current.filter(
      (exercise) => exercise.exerciseOrder !== undefined,
    )
    return currentSelected.join(",") !== initialSelected.join(",")
  }

  const handleResetExercises = () => {
    setExercises((current) => ({
      ...current,
      data: initialExercises.current,
    }))
  }

  const fetchExercises = useCallback(async () => {
    setExercises((current) => ({ ...current, isLoading: true }))
    try {
      const data = await getAllExercisesWithOptionalOrder(setId)
      if (!mountedRef.current) return
      const sorted = sortExercises(data)
      initialExercises.current = sorted
      setExercises({ data: sorted, isLoading: false, error: null })
    } catch (error) {
      if (!mountedRef.current) return
      setExercises((current) => ({
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

  return [exercises, setExercises, handleResetExercises, hasChanged()]
}

export default useSetExercises
