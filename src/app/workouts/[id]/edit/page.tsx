import { redirect } from "next/navigation"

import type { Metadata } from "next"
import type { PageProps } from "@/types"

import WorkoutForm from "@/components/forms/WorkoutForm"
import { getWorkoutById } from "@/lib/actions/workouts"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const EditPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  const workout = await getWorkoutById(parseInt(id, 10))

  if (!workout) {
    return redirect(paths.workouts())
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Edit {workout.name}
      </h1>

      <WorkoutForm
        initialValues={{
          name: workout.name,
          description: workout.description,
          restTime: workout.restTime,
          id: workout.id,
        }}
      />
    </>
  )
}

export default EditPage
