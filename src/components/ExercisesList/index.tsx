import React from "react"
import Link from "next/link"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  getAllExercisesWithOptionalSetInfo,
  deleteExerciseIfUnused,
} from "@/lib/actions/exercises"
import DeleteButton from "@/components/DeleteButton"
import { paths } from "@/lib/utils"

interface Props {
  setId?: number
}

const ExercisesList = async ({ setId }: Props) => {
  const exercises = await getAllExercisesWithOptionalSetInfo(setId)

  return (
    <ul className="grid grid-cols-3 gap-2 grid-rows-subgrid my-4">
      {exercises.length === 0 && (
        <li className="font-semibold"> 🤷‍♂️ no exercises yet</li>
      )}

      {exercises.map(({ id, name, reps, duration, sets }) => {
        return (
          <li key={id} className="grid grid-rows-subgrid row-span-2">
            <Card className="grid grid-rows-subgrid row-span-2 relative hover:opacity-85 active:opacity-75">
              <Link
                href={paths.exercises(id)}
                className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer rounded-lg"
              />
              <CardHeader>
                <CardTitle className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground"></span>
                  <span>{name}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {!!reps ? `Reps: ${reps}` : ""}
                  {!!duration ? `, Duration: ${duration} seconds` : ""}
                </CardDescription>
                <CardAction>
                  <DeleteButton id={id} action={deleteExerciseIfUnused} />
                </CardAction>
              </CardHeader>
              <CardFooter>
                <ul className="list-disc pl-4">
                  {sets.length === 0 && <li>no sets associated</li>}
                  {sets.map((set) => (
                    <li key={set.setId}>
                      {set.workoutName ? `workout: ${set.workoutName} > ` : ""}
                      set: {set.setName}
                    </li>
                  ))}
                </ul>
              </CardFooter>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

export default ExercisesList
