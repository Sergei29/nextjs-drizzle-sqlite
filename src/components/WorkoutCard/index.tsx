import Link from "next/link"

import type { WorkoutSummary } from "@/types"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteButton from "@/components/DeleteButton"
import { deleteWorkout } from "@/lib/actions/workouts"
import { cn, paths } from "@/lib/utils"

interface Props {
  workout: WorkoutSummary
  className?: string
}

const WorkoutCard = ({ workout, className }: Props) => {
  const { name, description, id } = workout
  return (
    <Card
      className={cn("relative hover:opacity-85 active:opacity-75", className)}
    >
      <Link
        href={paths.workouts(workout.id)}
        className="absolute top-0 bottom-0 left-0 right-0 cursor-pointer rounded-lg"
      />
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
        <CardAction>
          <DeleteButton id={id} action={deleteWorkout} />
        </CardAction>
      </CardHeader>
      <CardFooter> {workout.sets.length} sets</CardFooter>
    </Card>
  )
}

export default WorkoutCard
