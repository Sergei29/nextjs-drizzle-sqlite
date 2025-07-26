import { redirect } from "next/navigation"

import type { Metadata } from "next"
import type { PageProps } from "@/types"

import ExerciseForm from "@/components/forms/ExerciseForm"
import { getExerciseByIdWithSets } from "@/lib/actions/exercises"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const EditPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  const exercise = await getExerciseByIdWithSets(Number(id))

  if (!exercise) {
    redirect(paths.exercises())
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Edit {exercise.name}
      </h1>
      <div className="max-w-3xl mx-auto my-4">
        {exercise.sets.length > 0 && (
          <p className="text-red-500">
            Current exercise has {exercise.sets.length} sets associated.
            <ul>
              {exercise.sets.map((set) => (
                <li key={set.setId}>
                  {set.workoutName ? `workout: ${set.workoutName} > ` : ""}
                  set: {set.setName}
                </li>
              ))}
            </ul>
          </p>
        )}
      </div>
      <ExerciseForm
        initialValues={{
          name: exercise.name,
          description: exercise.description || undefined,
          imageUrl: exercise.imageUrl || undefined,
          reps: exercise.reps || 0,
          duration: exercise.duration || 0,
          id: exercise.id,
        }}
      />
    </>
  )
}

export default EditPage
