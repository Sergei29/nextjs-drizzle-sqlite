import { Suspense } from "react"

import { Plus } from "lucide-react"

import type { Metadata } from "next"

import WorkoutsList from "@/components/WorkoutsList"
import IconButton from "@/components/IconButton"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const WorkoutsListPage = async () => {
  return (
    <>
      <div className="flex gap-4 justify-center items-center mt-8 mb-16">
        <h1 className="text-3xl font-bold underline text-center">
          Workouts List page
        </h1>
        <IconButton href={paths.workouts("create")} title="add new">
          <Plus />
        </IconButton>
      </div>

      <Suspense fallback={<p className="font-semibold">Loading workouts...</p>}>
        <WorkoutsList />
      </Suspense>
    </>
  )
}

export default WorkoutsListPage
