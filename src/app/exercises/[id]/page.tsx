import { redirect } from "next/navigation"
import { SquarePen, Plus } from "lucide-react"
import Image from "next/image"

import type { Metadata } from "next"
import type { PageProps } from "@/types"

import { Card, CardFooter, CardContent, CardHeader } from "@/components/ui/card"
import DeleteButton from "@/components/DeleteButton"
import IconButton from "@/components/IconButton"
import {
  getExerciseByIdWithSets,
  deleteExerciseIfUnused,
} from "@/lib/actions/exercises"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const ExerciseDetailsPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  const exercise = await getExerciseByIdWithSets(Number(id))

  if (!exercise) {
    redirect(paths.exercises())
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 justify-center items-center">
          <h1 className="text-3xl font-bold underline text-center">
            {exercise.name}
          </h1>
          <IconButton href={paths.exercises("create")} title="add new">
            <Plus />
          </IconButton>
        </div>
      </CardHeader>
      <CardContent className="flex-col gap-4">
        <div className="flex justify-center mx-auto mb-4 max-h-[200px]">
          <Image
            src={exercise.imageUrl || "/images/placeholder.png"}
            alt={exercise.name}
            width={200}
            height={200}
          />
        </div>
        <p>
          <span className="font-bold underline text-yellow-500">About</span>:{" "}
          {exercise.description}
        </p>
        {!!exercise.reps && (
          <p>
            {" "}
            <span className="font-bold underline text-yellow-500">
              Reps
            </span>: {exercise.reps}.
          </p>
        )}

        {!!exercise.duration && (
          <p>
            {" "}
            <span className="font-bold underline text-yellow-500">
              Duration
            </span>
            : {exercise.duration} seconds.
          </p>
        )}

        <ul className="list-disc pl-4">
          {exercise.sets.length === 0 && <li>no sets associated</li>}
          {exercise.sets.map((set) => (
            <li key={set.setId}>
              {set.workoutName ? `workout: ${set.workoutName} > ` : ""}
              set: {set.setName}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <IconButton title="Edit" href={paths.exercises(`${exercise.id}/edit`)}>
          <SquarePen />
        </IconButton>
        <DeleteButton id={exercise.id} action={deleteExerciseIfUnused} />
      </CardFooter>
    </Card>
  )
}

export default ExerciseDetailsPage
