import type { Metadata } from "next"

export const metadata: Metadata = {}

const ExercisesListPage = async () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Exercises List page
      </h1>
    </>
  )
}

export default ExercisesListPage
