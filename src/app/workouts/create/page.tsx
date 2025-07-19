import type { Metadata } from "next"

import WorkoutForm from "@/components/forms/WorkoutForm"

export const metadata: Metadata = {}

const CreateWorkoutPage = async () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Create Workout page
      </h1>
      <WorkoutForm />
    </>
  )
}

export default CreateWorkoutPage
