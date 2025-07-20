import type { Metadata } from "next"
import type { PageProps } from "@/types"

import SetForm from "@/components/forms/SetForm"
import { getWorkoutSelectOptions } from "@/lib/actions/workouts"

export const metadata: Metadata = {}

const CreateSetPage = async ({
  searchParams,
}: PageProps<object, { workoutId?: string }>) => {
  const { workoutId } = await searchParams
  const workoutOptions = await getWorkoutSelectOptions()

  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Create Set page
      </h1>
      <SetForm
        workoutId={workoutId ? parseInt(workoutId, 10) : undefined}
        workoutOptions={workoutOptions}
      />
    </>
  )
}

export default CreateSetPage
