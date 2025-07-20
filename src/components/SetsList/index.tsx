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

import { getSetsBy, deleteSet } from "@/lib/actions/sets"
import DeleteButton from "@/components/DeleteButton"
import { paths } from "@/lib/utils"

interface Props {
  workoutId?: number
}

const SetsList = async ({ workoutId }: Props) => {
  const sets = await getSetsBy({ workoutId })

  return (
    <ul className="grid grid-cols-3 gap-2 grid-rows-subgrid">
      {sets.length === 0 && <li className="font-semibold"> 🤷‍♂️ no sets yet</li>}
      {sets.map((set) => {
        return (
          <li key={set.id} className="grid grid-rows-subgrid row-span-2">
            <Card className="grid grid-rows-subgrid row-span-2 relative hover:opacity-85 active:opacity-75">
              <Link
                href={paths.sets(set.id)}
                className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer rounded-lg"
              />
              <CardHeader>
                <CardTitle>{set.name}</CardTitle>
                <CardDescription className="text-xs">
                  {set.description}
                </CardDescription>
                <CardAction>
                  <DeleteButton id={set.id} action={deleteSet} />
                </CardAction>
              </CardHeader>
              <CardFooter> {set.setExercises.length} exercises</CardFooter>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

export default SetsList
