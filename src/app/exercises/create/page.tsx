import type { Metadata } from "next"

import ExerciseForm from "@/components/forms/ExerciseForm"

export const metadata: Metadata = {}

const CreateExercisePage = async () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Create Exercise page
      </h1>
      <ExerciseForm />
    </>
  )
}

export default CreateExercisePage
