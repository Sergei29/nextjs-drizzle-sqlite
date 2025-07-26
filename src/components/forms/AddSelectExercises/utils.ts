import type { OrderedExercise } from "@/lib/actions/exercises"

export const sortExercises = (
  exercises: OrderedExercise[],
): OrderedExercise[] => {
  return exercises
    .map((exercise) => ({
      ...exercise,
      isSelected:
        exercise.exerciseOrder !== undefined && exercise.exerciseOrder !== null,
    }))
    .sort((a, b) => {
      const aHasOrder = typeof a.exerciseOrder === "number"
      const bHasOrder = typeof b.exerciseOrder === "number"

      if (aHasOrder && bHasOrder) {
        return a.exerciseOrder! - b.exerciseOrder!
      }

      if (aHasOrder) return -1 // a has order, b doesn't → a comes first
      if (bHasOrder) return 1 // b has order, a doesn't → b comes first

      return 0 // neither has order → keep as-is
    })
}

export const toggleSelectExercise = ({
  exercises,
  id,
}: {
  exercises: OrderedExercise[]
  id: number
}) => {
  const countSelected = exercises.filter(
    (exercise) => !!exercise.exerciseOrder,
  ).length
  const updated = exercises.map((exercise) => {
    if (exercise.id === id) {
      return {
        ...exercise,
        exerciseOrder: exercise.exerciseOrder ? undefined : countSelected + 1,
      }
    }
    return exercise
  })
  return sortExercises(updated)
}
