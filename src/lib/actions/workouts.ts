"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { ServerActionReturn } from "@/types"

import { createWorkoutSchema, updateWorkoutSchema } from "@/lib/validation"
import { getErrorMessage, paths } from "@/lib/utils"
import { workouts } from "@drizzle/schema"
import { db } from "@/lib/db"

export const getWorkouts = async (limit?: number) => {
  const data = await db.query.workouts.findMany({
    limit,
    with: {
      sets: {
        columns: {
          id: true,
          name: true,
          setNumber: true,
        },
        orderBy(fields, { asc }) {
          return asc(fields.setNumber)
        },
      },
    },
  })

  return data
}

export const getWorkoutById = async (workoutId: number) => {
  const data = await db.query.workouts.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, workoutId)
    },
    with: {
      sets: true,
    },
  })

  return data
}

export const createNewWorkout = async ({
  input,
}: {
  input: unknown
}): Promise<
  ServerActionReturn<{
    id: number
    name: string
  }>
> => {
  try {
    const validation = createWorkoutSchema.safeParse(input)

    if (!validation.success) {
      const errors = validation.error.issues.map(({ message, path }) => ({
        [path[0]]: message,
      }))

      return { success: false, errors }
    }

    const [newWorkout] = await db
      .insert(workouts)
      .values({
        name: validation.data.name,
        description: validation.data.description,
        restTime: validation.data.restTime,
      })
      .returning()

    revalidatePath(paths.home())
    revalidatePath(paths.workouts())

    return {
      success: true,
      data: {
        id: newWorkout.id,
        name: newWorkout.name,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

export const updateWorkout = async ({
  workoutId,
  input,
}: {
  workoutId: number
  input: unknown
}): Promise<
  ServerActionReturn<{
    id: number
    name: string
  }>
> => {
  try {
    const validation = updateWorkoutSchema.safeParse(input)

    if (!validation.success) {
      const errors = validation.error.issues.map(({ message, path }) => ({
        [path[0]]: message,
      }))

      return { success: false, errors }
    }

    const [updatedWorkout] = await db
      .update(workouts)
      .set({
        name: validation.data.name,
        description: validation.data.description,
        restTime: validation.data.restTime,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(workouts.id, workoutId))
      .returning()

    revalidatePath(paths.home())
    revalidatePath(paths.workouts())

    return {
      success: true,
      data: {
        id: updatedWorkout.id,
        name: updatedWorkout.name,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

export const deleteWorkout = async (
  workoutId: number,
): Promise<
  ServerActionReturn<{
    id: number
    name: string
  }>
> => {
  try {
    const [deletedWorkout] = await db
      .delete(workouts)
      .where(eq(workouts.id, workoutId))
      .returning()

    revalidatePath(paths.home())
    revalidatePath(paths.workouts())

    return {
      success: true,
      data: {
        id: deletedWorkout.id,
        name: deletedWorkout.name,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}
