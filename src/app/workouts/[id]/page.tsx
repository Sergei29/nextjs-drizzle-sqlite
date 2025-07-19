import type { Metadata } from "next"
import type { PageProps } from "@/types"

export const metadata: Metadata = {}

const WorkoutDetailsPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Workout Details page: {id}
      </h1>
    </>
  )
}

export default WorkoutDetailsPage
