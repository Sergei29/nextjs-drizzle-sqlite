import { getWorkouts } from "@/lib/actions/workouts"
import WorkoutCard from "@/components/WorkoutCard"

interface Props {
  limit?: number
}

const WorkoutsList = async ({ limit }: Props) => {
  const workouts = await getWorkouts(limit)

  return (
    <ul className="grid grid-cols-3 gap-2 grid-rows-subgrid">
      {workouts.length === 0 && (
        <li className="font-semibold"> 🤷‍♂️ no workouts yet</li>
      )}
      {workouts.map((workout) => {
        return (
          <li key={workout.id} className="grid grid-rows-subgrid row-span-2">
            <WorkoutCard
              workout={workout}
              className="grid grid-rows-subgrid row-span-2"
            />
          </li>
        )
      })}
    </ul>
  )
}

export default WorkoutsList
