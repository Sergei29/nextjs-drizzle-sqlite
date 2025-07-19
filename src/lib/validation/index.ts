import { z } from "zod"

export const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.number().min(1, "Rest between sets in seconds required"),
})

export const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.number().min(1, "Rest between sets in seconds required"),
})

export const createSetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.number().min(1, "Rest between exercises in seconds required"),
  setNumber: z.number().min(1, "Set order is required"),
  workoutId: z.number(),
})

export const updateSetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  restTime: z.number().min(1, "Rest between exercises in seconds required"),
  setNumber: z.number().min(1, "Set order is required"),
  workoutId: z.number(),
})
