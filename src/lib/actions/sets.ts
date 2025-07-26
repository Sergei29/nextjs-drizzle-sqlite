"use server"

import { eq, and, not, count } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { ServerActionReturn } from "@/types"

import { setSchema } from "@/lib/validation"
import { getErrorMessage, paths } from "@/lib/utils"
import { sets } from "@drizzle/schema"
import { db } from "@/lib/db"

export const getSetsBy = async ({
  workoutId,
  id,
}: {
  workoutId?: number
  id?: number
}) => {
  const data = await db.query.sets.findMany({
    where: workoutId
      ? (fields, { eq }) => {
          return eq(fields.workoutId, workoutId)
        }
      : id
        ? (fields, { eq }) => {
            return eq(fields.id, id)
          }
        : undefined,
    orderBy: (fields, { asc }) => {
      return workoutId ? asc(fields.setOrder) : asc(fields.workoutId)
    },
    with: {
      workout: {
        columns: {
          id: true,
          name: true,
        },
      },
      setExercises: {
        orderBy: (fields, { asc }) => asc(fields.exerciseOrder),
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

export const getSetsCount = async ({ workoutId }: { workoutId?: number }) => {
  if (!workoutId) {
    return 0
  }

  const data = await db.query.sets.findMany({
    where: eq(sets.workoutId, workoutId),
  })

  return data.length
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

    const newSet = await createSetWithAutoSwap(validation.data)

    revalidatePath(paths.sets())
    revalidatePath(paths.workouts(newSet.workoutId))

    return {
      success: true,
      data: {
        id: newSet.id,
        name: newSet.name ?? `Set ${newSet.setOrder}`,
      },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}

type UpdateSetParams = {
  id: number
  name: string
  restTime: number
  setOrder: number
  workoutId: number
  description?: string | null | undefined
}

async function createSetWithAutoSwap(input: Omit<UpdateSetParams, "id">) {
  const { name, restTime, setOrder, workoutId, description } = input

  return await db.transaction(async (tx) => {
    // Step 1: Check for a conflicting set
    const [conflictingSet] = await tx
      .select()
      .from(sets)
      .where(and(eq(sets.workoutId, workoutId), eq(sets.setOrder, setOrder)))

    if (conflictingSet) {
      // Step 1a: Move conflicting set to a temporary order (-1)
      await tx
        .update(sets)
        .set({ setOrder: -1 }) // TEMP value must not conflict with any real setOrder
        .where(eq(sets.id, conflictingSet.id))
    }

    // Step 2: Create the new set
    const [newSet] = await tx
      .insert(sets)
      .values({
        name,
        restTime,
        setOrder,
        workoutId,
        description,
      })
      .returning()

    // Step 3: If we had a conflicting set, move it to the new setOrder to the last position
    if (conflictingSet) {
      const result = await tx
        .select({ count: count() })
        .from(sets)
        .where(eq(sets.workoutId, workoutId))
      const setsCount = result[0].count

      await tx
        .update(sets)
        .set({ setOrder: setsCount + 1, updatedAt: new Date().toISOString() })
        .where(eq(sets.id, conflictingSet.id))
    }

    return newSet
  })
}

async function updateSetWithAutoSwap(params: UpdateSetParams) {
  const {
    id,
    name,
    restTime,
    setOrder: newSetOrder,
    workoutId,
    description,
  } = params

  return await db.transaction(async (tx) => {
    // Step 1: Get current set
    const [currentSet] = await tx.select().from(sets).where(eq(sets.id, id))

    if (!currentSet) {
      throw new Error("Set not found")
    }

    const currentSetOrder = currentSet.setOrder

    // Step 2: If setOrder is unchanged, no need to proceed with swap logic
    if (currentSetOrder === newSetOrder) {
      const [updated] = await tx
        .update(sets)
        .set({
          name,
          restTime,
          setOrder: newSetOrder,
          workoutId,
          description,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(sets.id, id))
        .returning()
      return updated
    }

    // Step 3: Check for a conflicting set
    const [conflictingSet] = await tx
      .select()
      .from(sets)
      .where(
        and(
          eq(sets.workoutId, workoutId),
          eq(sets.setOrder, newSetOrder),
          not(eq(sets.id, id)),
        ),
      )

    if (conflictingSet) {
      // Step 3a: Move current set to temporary order (-1)
      await tx
        .update(sets)
        .set({ setOrder: -1 }) // TEMP value must not conflict with any real setOrder
        .where(eq(sets.id, id))

      // Step 3b: Move conflicting set to the currentSetOrder
      await tx
        .update(sets)
        .set({ setOrder: currentSetOrder, updatedAt: new Date().toISOString() })
        .where(eq(sets.id, conflictingSet.id))

      // Step 3c: Now move current set to desired newSetOrder
      const [finalUpdate] = await tx
        .update(sets)
        .set({
          name,
          restTime,
          setOrder: newSetOrder,
          workoutId,
          description,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(sets.id, id))
        .returning()

      return finalUpdate
    } else {
      // No conflict — safe to update directly
      const [updated] = await tx
        .update(sets)
        .set({
          name,
          restTime,
          setOrder: newSetOrder,
          workoutId,
          description,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(sets.id, id))
        .returning()

      return updated
    }
  })
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

    const updatedSet = await updateSetWithAutoSwap({
      ...validation.data,
      id: setId,
    })

    revalidatePath(paths.sets())
    revalidatePath(paths.workouts(updatedSet.workoutId))
    return {
      success: true,
      data: {
        id: updatedSet.id,
        name: updatedSet.name ?? `Set ${updatedSet.setOrder}`,
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
      name: deletedSet.name ?? `Set ${deletedSet.setOrder}`,
    },
  }
}

export const reorderSets = async ({
  reorderedSets,
}: {
  reorderedSets: { id: number; setOrder: number; workoutId: number }[]
}): Promise<
  ServerActionReturn<{
    ids: number[]
  }>
> => {
  try {
    await db.transaction(async (tx) => {
      // STEP 1: Temporarily shift all to avoid uniqueness conflict
      await Promise.all(
        reorderedSets.map(({ id, setOrder }) =>
          tx
            .update(sets)
            .set({ setOrder: setOrder + 1000 }) // TEMP shift
            .where(eq(sets.id, id)),
        ),
      )

      // STEP 2: Apply actual new ordering
      await Promise.all(
        reorderedSets.map(({ id, setOrder }) =>
          tx
            .update(sets)
            .set({ setOrder, updatedAt: new Date().toISOString() })
            .where(eq(sets.id, id)),
        ),
      )
    })

    revalidatePath(paths.sets())
    revalidatePath(paths.workouts(reorderedSets[0].workoutId))

    return {
      success: true,
      data: { ids: reorderedSets.map(({ id }) => id) },
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ root: getErrorMessage(error) }],
    }
  }
}
