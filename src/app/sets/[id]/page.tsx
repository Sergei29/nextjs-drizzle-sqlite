import { redirect } from "next/navigation"
import { SquarePen } from "lucide-react"

import type { Metadata } from "next"
import type { PageProps } from "@/types"

import { getSetsBy, deleteSet } from "@/lib/actions/sets"
import { Card, CardFooter, CardContent, CardHeader } from "@/components/ui/card"
import DeleteButton from "@/components/DeleteButton"
import IconButton from "@/components/IconButton"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const SetDetailsPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  const [set] = await getSetsBy({ id: parseInt(id, 10) })

  if (!set) {
    return redirect(paths.sets())
  }

  return (
    <>
      {" "}
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold underline text-center">
            {set.name}
          </h1>
        </CardHeader>
        <CardContent className="flex-col gap-4">
          <p>
            <span className="font-bold">About</span>: {set.description}
          </p>
          <p>
            {" "}
            <span className="font-bold">Rest between exercises</span>:{" "}
            {set.restTime} seconds.
          </p>
          <ul className="list-disc pl-4">
            {set.setExercises.length === 0 && <li>no exercises</li>}
            {set.setExercises.map((exercise) => {
              return <li key={exercise.exerciseId}>{exercise.exercise.name}</li>
            })}
          </ul>
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <IconButton title="Edit" href={paths.sets(`${set.id}/edit`)}>
            <SquarePen />
          </IconButton>
          <DeleteButton id={set.id} action={deleteSet} />
        </CardFooter>
      </Card>
    </>
  )
}

export default SetDetailsPage
