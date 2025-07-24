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

export const exerciseSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    reps: z.coerce.number().optional() as unknown as z.ZodCoercedNumber<number>,
    duration: z.coerce
      .number()
      .optional() as unknown as z.ZodCoercedNumber<number>,
  })
  .refine(
    (data) => {
      if (!data.reps && !data.duration) {
        return false
      } else if (data.reps && data.duration) {
        return false
      }
      return true
    },
    {
      message: "Either reps or duration is to be provided",
      path: ["reps"],
    },
  )
