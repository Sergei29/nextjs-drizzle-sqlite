"use server"

import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { ServerActionReturn } from "@/types"

import { exerciseSchema } from "@/lib/validation"
import { getErrorMessage, paths } from "@/lib/utils"
import { exercises, setExercises, sets, workouts } from "@drizzle/schema"
import { db } from "@/lib/db"

type DetailedExercise = {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  reps: number | null
  duration: number | null
  sets: {
    setId: number
    setName: string | null
    workoutId: number | null
    workoutName: string | null
  }[]
}

export const getExerciseByIdWithSets = async (
  exerciseId: number,
): Promise<DetailedExercise | null> => {
  const rows = await db
    .select({
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      exerciseDescription: exercises.description,
      imageUrl: exercises.imageUrl,
      reps: exercises.reps,
      duration: exercises.duration,
      setId: sets.id,
      setName: sets.name,
      workoutId: workouts.id,
      workoutName: workouts.name,
    })
    .from(exercises)
    .leftJoin(setExercises, eq(setExercises.exerciseId, exercises.id))
    .leftJoin(sets, eq(setExercises.setId, sets.id))
    .leftJoin(workouts, eq(sets.workoutId, workouts.id))
    .where(eq(exercises.id, exerciseId))

  if (rows.length === 0) return null

  const first = rows[0]

  return {
    id: first.exerciseId,
    name: first.exerciseName,
    description: first.exerciseDescription,
    imageUrl: first.imageUrl,
    reps: first.reps,
    duration: first.duration,
    sets: rows
      .filter((r) => !!r.setId)
      .map((r) => ({
        setId: r.setId as number,
        setName: r.setName,
        workoutId: r.workoutId,
        workoutName: r.workoutName,
      })),
  }
}

export const getAllExercisesWithOptionalSetInfo = async (setId?: number) => {
  const rows = await db
    .select({
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      exerciseDescription: exercises.description,
      imageUrl: exercises.imageUrl,
      reps: exercises.reps,
      duration: exercises.duration,
      setId: sets.id,
      setName: sets.name,
      workoutId: workouts.id,
      workoutName: workouts.name,
    })
    .from(exercises)
    .leftJoin(setExercises, eq(setExercises.exerciseId, exercises.id))
    .leftJoin(sets, eq(setExercises.setId, sets.id))
    .leftJoin(workouts, eq(sets.workoutId, workouts.id))
    .where(setId !== undefined ? eq(setExercises.setId, setId) : undefined)
    .orderBy(exercises.id)

  // Grouping sets under each exercise
  const grouped = new Map<number, DetailedExercise>()

  for (const row of rows) {
    const existing = grouped.get(row.exerciseId)
    const setEntry =
      row.setId !== null
        ? {
            setId: row.setId,
            setName: row.setName,
            workoutId: row.workoutId,
            workoutName: row.workoutName,
          }
        : null

    if (!existing) {
      grouped.set(row.exerciseId, {
        id: row.exerciseId,
        name: row.exerciseName,
        description: row.exerciseDescription,
        imageUrl: row.imageUrl,
        reps: row.reps,
        duration: row.duration,
        sets: setEntry ? [setEntry] : [],
      })
    } else {
      if (setEntry) existing.sets.push(setEntry)
    }
  }

  return Array.from(grouped.values())
}

export type OrderedExercise = {
  id: number
  name: string
  duration: number | null
  reps: number | null
  exerciseOrder?: number
}

/**
 * Fetch all exercises.
 * - Optionally include `exerciseOrder` only if the exercise is used in a specific `setId`.
 * - used in `AddSelectExercises` to show exercises with their order in a set.
 * @param setId - Optional set ID to filter exercises by a specific set.
 * @return {Promise<OrderedExercise[]>} - List of exercises with optional order.
 */
export const getAllExercisesWithOptionalOrder = async (setId?: number) => {
  const rows = await db
    .select({
      id: exercises.id,
      name: exercises.name,
      duration: exercises.duration,
      reps: exercises.reps,
      setId: setExercises.setId,
      exerciseOrder: setExercises.exerciseOrder,
    })
    .from(exercises)
    .leftJoin(setExercises, eq(setExercises.exerciseId, exercises.id))
    .orderBy(exercises.id)

  // Group by exerciseId to avoid duplicates in case exercise belongs to multiple sets
  const seen = new Map<number, OrderedExercise>()

  for (const row of rows) {
    if (!seen.has(row.id)) {
      const entry: OrderedExercise = {
        id: row.id,
        name: row.name,
        duration: row.duration,
        reps: row.reps,
        ...(setId !== undefined &&
        row.setId === setId &&
        row.exerciseOrder !== null
          ? { exerciseOrder: row.exerciseOrder }
          : {}),
      }
      seen.set(row.id, entry)
    }
  }

  return Array.from(seen.values())
}

type Exercise = {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  reps: number | null
  duration: number | null
}

export const createExercise = async (
  rawInput: unknown,
): Promise<ServerActionReturn<Exercise>> => {
  try {
    // 1. Validate input
    const result = exerciseSchema.safeParse(rawInput)

    if (!result.success) {
      // Map Zod issues to a field-level error object
      const errors = result.error.issues.map(({ message, path }) => ({
        [path[0]]: message,
      }))

      return {
        success: false,
        errors, // e.g. { "name": "Exercise name is required", "imageUrl": "Invalid image URL" }
      }
    }

    // 2. Insert into exercises
    const [exercise] = await db
      .insert(exercises)
      .values({
        name: result.data.name,
        description: result.data.description,
        imageUrl: result.data.imageUrl,
        reps: result.data.reps,
        duration: result.data.duration,
      })
      .returning()

    // 3. Optional linking to set
    if (result.data.setId && result.data.exerciseOrder !== undefined) {
      await db.insert(setExercises).values({
        setId: result.data.setId,
        exerciseId: exercise.id,
        exerciseOrder: result.data.exerciseOrder,
      })
    }

    revalidatePath(paths.exercises(exercise.id))
    revalidatePath(paths.exercises())
    if (result.data.setId) {
      // Revalidate the specific set page if linked
      revalidatePath(paths.sets(result.data.setId))
    }

    return {
      success: true,
      data: exercise,
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

export const updateExercise = async (
  exerciseId: number,
  rawInput: unknown,
): Promise<ServerActionReturn<Exercise>> => {
  try {
    const result = exerciseSchema.safeParse(rawInput)

    if (!result.success) {
      // Map Zod issues to a field-level error object
      const errors = result.error.issues.map(({ message, path }) => ({
        [path[0]]: message,
      }))

      return {
        success: false,
        errors, // e.g. { "name": "Exercise name is required", "imageUrl": "Invalid image URL" }
      }
    }

    const input = result.data

    // 1. Update exercise fields (if any provided)
    const updatedFields = {
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      reps: input.reps,
      duration: input.duration,
      updatedAt: new Date().toISOString(),
    }

    await db
      .update(exercises)
      .set(updatedFields)
      .where(eq(exercises.id, exerciseId))

    // 2. If setId + exerciseOrder are provided
    if (input.setId && input.exerciseOrder !== undefined) {
      // Check if there's an existing record
      const [existing] = await db
        .select()
        .from(setExercises)
        .where(eq(setExercises.exerciseId, exerciseId))

      // 3. If there's a conflicting order, swap it
      const [conflict] = await db
        .select()
        .from(setExercises)
        .where(
          and(
            eq(setExercises.setId, input.setId),
            eq(setExercises.exerciseOrder, input.exerciseOrder),
          ),
        )

      if (conflict && conflict.exerciseId !== exerciseId) {
        // Swap the conflicting exercise to the old order (if exists) or a temporary number
        const newOrder = existing?.exerciseOrder ?? 9999

        await db
          .update(setExercises)
          .set({ exerciseOrder: newOrder })
          .where(eq(setExercises.exerciseId, conflict.exerciseId))
      }

      // 4. Upsert (insert or update) this exercise’s set entry
      if (existing) {
        await db
          .update(setExercises)
          .set({
            setId: input.setId,
            exerciseOrder: input.exerciseOrder,
          })
          .where(eq(setExercises.exerciseId, exerciseId))
      } else {
        await db.insert(setExercises).values({
          setId: input.setId,
          exerciseId,
          exerciseOrder: input.exerciseOrder,
        })
      }
    }

    revalidatePath(paths.exercises(exerciseId))
    revalidatePath(paths.exercises())
    if (input.setId) {
      // Revalidate the specific set page if linked
      revalidatePath(paths.sets(input.setId))
    }

    return {
      success: true,
      data: {
        id: exerciseId,
        name: updatedFields.name,
        description: updatedFields.description || null,
        imageUrl: updatedFields.imageUrl || null,
        reps: updatedFields.reps || null,
        duration: updatedFields.duration || null,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

const idSchema = z.number().int().positive()

/**
 * Cascading Deletes: What happens to `set_exercises`?
 * So when you delete an exercise, Drizzle/SQLite will
 * automatically delete any related rows in `set_exercises`.
 * No need to manually delete from `set_exercises` — the database handles it.
 */
export const deleteExerciseIfUnused = async (
  rawId: unknown,
): Promise<ServerActionReturn<{ id: number; name: string }>> => {
  try {
    const result = idSchema.safeParse(rawId)
    if (!result.success) {
      return { success: false, errors: [{ root: "Invalid exercise ID" }] }
    }

    const exerciseId = result.data

    // 1. Check if it's used in any set
    const [isUsed] = await db
      .select({ exerciseId: setExercises.exerciseId })
      .from(setExercises)
      .where(eq(setExercises.exerciseId, exerciseId))
      .limit(1)

    if (isUsed) {
      return {
        success: false,
        errors: [
          { root: "Cannot delete: exercise is assigned to one or more sets." },
        ],
      }
    }

    // 2. Safe to delete
    const [deleted] = await db
      .delete(exercises)
      .where(eq(exercises.id, exerciseId))
      .returning()

    return { success: true, data: { id: deleted.id, name: deleted.name } }
  } catch (error) {
    return { success: false, errors: [{ root: getErrorMessage(error) }] }
  }
}

/**
 * Updates the order of an exercise within a specific set.
 * @example
 * await updateExerciseOrderInSet({
 *   setId: 1,
 *   exerciseId: 101,
 *   newOrder: 3,
 * });
 * @param param - The parameters for updating the exercise order.
 * @returns A promise that resolves to the result of the update operation.
 */
export const updateExerciseOrderInSet = async ({
  setId,
  exerciseId,
  newOrder,
}: {
  setId: number
  exerciseId: number
  newOrder: number
}): Promise<ServerActionReturn<{ id: number; newOrder: number }>> => {
  // 1. Get current exercise order
  const [currentEntry] = await db
    .select({
      exerciseOrder: setExercises.exerciseOrder,
    })
    .from(setExercises)
    .where(
      and(
        eq(setExercises.setId, setId),
        eq(setExercises.exerciseId, exerciseId),
      ),
    )

  if (!currentEntry) {
    return { success: false, errors: [{ root: "Exercise not found in set." }] }
  }

  const currentOrder = currentEntry.exerciseOrder

  if (currentOrder === newOrder) {
    return { success: true, data: { id: exerciseId, newOrder } }
  }

  // 2. Check for conflict
  const [conflict] = await db
    .select({ exerciseId: setExercises.exerciseId })
    .from(setExercises)
    .where(
      and(
        eq(setExercises.setId, setId),
        eq(setExercises.exerciseOrder, newOrder),
      ),
    )

  // 3. Begin transaction
  await db.transaction(async (tx) => {
    const TEMP_ORDER = -1

    if (conflict && conflict.exerciseId !== exerciseId) {
      // Step 1: Move current to TEMP to avoid unique conflict
      await tx
        .update(setExercises)
        .set({ exerciseOrder: TEMP_ORDER })
        .where(
          and(
            eq(setExercises.setId, setId),
            eq(setExercises.exerciseId, exerciseId),
          ),
        )

      // Step 2: Move conflicting to current's position
      await tx
        .update(setExercises)
        .set({ exerciseOrder: currentOrder })
        .where(
          and(
            eq(setExercises.setId, setId),
            eq(setExercises.exerciseId, conflict.exerciseId),
          ),
        )

      // Step 3: Move original to new position
      await tx
        .update(setExercises)
        .set({ exerciseOrder: newOrder })
        .where(
          and(
            eq(setExercises.setId, setId),
            eq(setExercises.exerciseId, exerciseId),
          ),
        )
    } else {
      // No conflict → just update
      await tx
        .update(setExercises)
        .set({ exerciseOrder: newOrder })
        .where(
          and(
            eq(setExercises.setId, setId),
            eq(setExercises.exerciseId, exerciseId),
          ),
        )
    }
  })

  return { success: true, data: { id: exerciseId, newOrder } }
}
