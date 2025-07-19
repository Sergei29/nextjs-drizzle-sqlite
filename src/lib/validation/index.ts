import { z } from "zod"

export const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.coerce
    .number()
    .min(
      1,
      "Rest between sets in seconds required",
    ) as z.ZodCoercedNumber<number>,
})

export const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.coerce
    .number()
    .min(
      1,
      "Rest between sets in seconds required",
    ) as z.ZodCoercedNumber<number>,
})

export const createSetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.coerce
    .number()
    .min(
      1,
      "Rest between exercises in seconds required",
    ) as z.ZodCoercedNumber<number>,
  setNumber: z.coerce
    .number()
    .min(1, "Set order is required") as z.ZodCoercedNumber<number>,
  workoutId: z.number().min(1, "Workout ID is required"),
})

export const updateSetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.coerce
    .number()
    .min(
      1,
      "Rest between exercises in seconds required",
    ) as z.ZodCoercedNumber<number>,
  setNumber: z.coerce
    .number()
    .min(1, "Set order is required") as z.ZodCoercedNumber<number>,
  workoutId: z.number().min(1, "Workout ID is required"),
})
