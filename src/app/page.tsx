import type { Metadata } from "next"

import { getWorkouts } from "@/lib/actions/workouts"

export const metadata: Metadata = {}

const HomePage = async () => {
  const workouts = await getWorkouts()

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8 underline">
        Hi! 👋 💪{" "}
      </h1>

      <section>
        <h2>Your featured workouts</h2>
        <ul className="grid grid-cols-3 gap-2">
          {workouts.length === 0 && (
            <li className="font-semibold"> 🤷‍♂️ no workouts yet</li>
          )}
          {workouts.map((workout) => {
            return (
              <li
                key={workout.id}
                className="rounded border border-slate-300 p-2"
              >
                <p>{workout.name}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

export default HomePage
