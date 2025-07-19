import type { Metadata } from "next"

export const metadata: Metadata = {}

const WorkoutsListPage = async () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">
        Workouts List page
      </h1>
    </>
  )
}

export default WorkoutsListPage
