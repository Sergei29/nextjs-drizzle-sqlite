import { Suspense } from "react"

import type { Metadata } from "next"

import WorkoutsList from "@/components/WorkoutsList"

export const metadata: Metadata = {}

const HomePage = async () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8 underline">
        Hi! 👋 💪{" "}
      </h1>

      <section>
        <h2 className="text-2xl font-semibold my-4">Your featured workouts</h2>
        <Suspense
          fallback={<p className="font-semibold">Loading workouts...</p>}
        >
          <WorkoutsList limit={4} />
        </Suspense>
      </section>
    </>
  )
}

export default HomePage
