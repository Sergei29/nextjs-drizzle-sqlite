import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  date: text("date").default("CURRENT_TIMESTAMP"),
  restTime: integer("rest_time").notNull(), // rest between sets in seconds
})

export const sets = sqliteTable("sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  name: text("name").default("Set"),
  description: text("description"),
  setNumber: integer("set_number"),
  restTime: integer("rest_time").notNull(), // rest between exercises in seconds
})

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"), // optional image URL
  reps: integer("reps"),
  duration: integer("duration"),
})

import { primaryKey } from "drizzle-orm/sqlite-core"

export const setExercises = sqliteTable(
  "set_exercises",
  {
    setId: integer("set_id")
      .notNull()
      .references(() => sets.id, { onDelete: "cascade" }),
    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.setId, table.exerciseId] }),
  }),
)
