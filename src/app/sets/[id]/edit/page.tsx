import { redirect } from "next/navigation"

import type { Metadata } from "next"
import type { PageProps } from "@/types"

import SetForm from "@/components/forms/SetForm"
import { getWorkoutSelectOptions } from "@/lib/actions/workouts"
import { getSetsBy } from "@/lib/actions/sets"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const EditPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params

  const [set] = await getSetsBy({ id: parseInt(id, 10) })
  if (!set) {
    return redirect(paths.sets())
  }
  const workoutOptions = await getWorkoutSelectOptions()
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Edit {set.name}
      </h1>

      <SetForm
        initialValues={{
          name: set.name || "",
          description: set.description,
          restTime: set.restTime,
          setOrder: set.setOrder,
          workoutId: set.workoutId,
          id: set.id,
        }}
        workoutOptions={workoutOptions}
      />
    </>
  )
}

export default EditPage
