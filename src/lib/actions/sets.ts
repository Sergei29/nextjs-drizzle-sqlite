"use server"

import { eq } from "drizzle-orm"

import { ServerActionReturn } from "@/types"

import { sets } from "@drizzle/schema"
import { db } from "@/lib/db"
import { createSetSchema, updateSetSchema } from "@/lib/validation"

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
            },
          },
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
  const validation = createSetSchema.safeParse(input)

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

  return {
    success: true,
    data: {
      id: newSet.id,
      name: newSet.name ?? `Set ${newSet.setNumber}`,
    },
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
  const validation = updateSetSchema.safeParse(input)

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

  return {
    success: true,
    data: {
      id: updatedSet.id,
      name: updatedSet.name ?? `Set ${updatedSet.setNumber}`,
    },
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

  return {
    success: true,
    data: {
      id: deletedSet.id,
      name: deletedSet.name ?? `Set ${deletedSet.setNumber}`,
    },
  }
}
