import { redirect } from "next/navigation"
import { SquarePen } from "lucide-react"

import type { Metadata } from "next"
import type { PageProps } from "@/types"

import { Card, CardFooter, CardContent, CardHeader } from "@/components/ui/card"
import DeleteButton from "@/components/DeleteButton"
import IconButton from "@/components/IconButton"
import { getWorkoutById, deleteWorkout } from "@/lib/actions/workouts"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const WorkoutDetailsPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  const workout = await getWorkoutById(parseInt(id, 10))

  if (!workout) {
    return redirect(paths.workouts())
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold underline text-center">
            {workout.name}
          </h1>
        </CardHeader>
        <CardContent className="flex-col gap-4">
          <p>
            <span className="font-bold">About</span>: {workout.description}
          </p>
          <p>
            {" "}
            <span className="font-bold">Rest between sets</span>:{" "}
            {workout.restTime} seconds.
          </p>
          <ul className="list-disc pl-4">
            {workout.sets.length === 0 && <li>no sets</li>}
            {workout.sets.map((set) => {
              return <li key={set.id}>{set.name}</li>
            })}
          </ul>
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <IconButton title="Edit" href={paths.workouts(`${workout.id}/edit`)}>
            <SquarePen />
          </IconButton>
          <DeleteButton id={workout.id} action={deleteWorkout} />
        </CardFooter>
      </Card>
    </>
  )
}

export default WorkoutDetailsPage
