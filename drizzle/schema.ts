import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { primaryKey } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
  name: text("name").notNull(),
  description: text("description"),
  restTime: integer("rest_time").notNull(), // rest between sets in seconds
})

export const sets = sqliteTable("sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  name: text("name").default("Set"),
  description: text("description"),
  setNumber: integer("set_number").notNull(),
  restTime: integer("rest_time").notNull(), // rest between exercises in seconds
})

export const workoutsRelations = relations(workouts, ({ many }) => ({
  sets: many(sets), // This links workouts to sets via sets.workoutId
}))

export const setsRelations = relations(sets, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [sets.workoutId],
    references: [workouts.id],
  }),
  setExercises: many(setExercises), // Reference the join table here
}))

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"), // optional image URL
  reps: integer("reps"),
  duration: integer("duration"),
})

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
