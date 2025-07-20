import { z } from "zod"

export const workoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.coerce
    .number()
    .min(
      1,
      "Rest between sets in seconds required",
    ) as z.ZodCoercedNumber<number>,
})

export const setSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.coerce
    .number()
    .min(
      1,
      "Rest between exercises in seconds required",
    ) as z.ZodCoercedNumber<number>,
  setOrder: z.coerce
    .number()
    .min(1, "Set order is required") as z.ZodCoercedNumber<number>,
  workoutId: z.coerce
    .number()
    .min(1, "Workout ID is required") as z.ZodCoercedNumber<number>,
})
