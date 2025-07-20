"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { ServerActionReturn } from "@/types"

import { setSchema } from "@/lib/validation"
import { getErrorMessage, paths } from "@/lib/utils"
import { sets } from "@drizzle/schema"
import { db } from "@/lib/db"

export const getSetsBy = async ({ workoutId }: { workoutId?: number }) => {
  const data = await db.query.sets.findMany({
    where: workoutId
      ? (fields, { eq }) => {
          return eq(fields.workoutId, workoutId)
        }
      : undefined,
    with: {
      setExercises: {
        with: {
          exercise: {
            columns: {
              id: true,
              name: true,
              exerciseNumber: true,
            },
          },
        },

        orderBy(fields, { asc }) {
          return asc(fields.exerciseId)
        },
      },
    },
  })

  return data
}

export const createNewSet = async ({
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
    const validation = setSchema.safeParse(input)

    if (!validation.success) {
      const errors = validation.error.issues.map(({ message, path }) => ({
        [path[0]]: message,
      }))

      return { success: false, errors }
    }

    const [newSet] = await db
      .insert(sets)
      .values({
        name: validation.data.name,
        description: validation.data.description,
        restTime: validation.data.restTime,
        setNumber: validation.data.setNumber,
        workoutId: validation.data.workoutId,
      })
      .returning()

    revalidatePath(paths.sets())
    revalidatePath(paths.workouts(newSet.workoutId))

    return {
      success: true,
      data: {
        id: newSet.id,
        name: newSet.name ?? `Set ${newSet.setNumber}`,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

export const updateSet = async ({
  setId,
  input,
}: {
  setId: number
  input: unknown
}): Promise<
  ServerActionReturn<{
    id: number
    name: string
  }>
> => {
  try {
    const validation = setSchema.safeParse(input)

    if (!validation.success) {
      const errors = validation.error.issues.map(({ message, path }) => ({
        [path[0]]: message,
      }))

      return { success: false, errors }
    }

    const [updatedSet] = await db
      .update(sets)
      .set({
        name: validation.data.name,
        description: validation.data.description,
        restTime: validation.data.restTime,
        setNumber: validation.data.setNumber,
        workoutId: validation.data.workoutId,
      })
      .where(eq(sets.id, setId))
      .returning()

    revalidatePath(paths.sets())
    revalidatePath(paths.workouts(updatedSet.workoutId))
    return {
      success: true,
      data: {
        id: updatedSet.id,
        name: updatedSet.name ?? `Set ${updatedSet.setNumber}`,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

export const deleteSet = async (
  setId: number,
): Promise<
  ServerActionReturn<{
    id: number
    name: string
  }>
> => {
  const [deletedSet] = await db
    .delete(sets)
    .where(eq(sets.id, setId))
    .returning()

  revalidatePath(paths.sets())
  revalidatePath(paths.workouts(deletedSet.workoutId))

  return {
    success: true,
    data: {
      id: deletedSet.id,
      name: deletedSet.name ?? `Set ${deletedSet.setNumber}`,
    },
  }
}
