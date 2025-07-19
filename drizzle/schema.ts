import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  date: text("date").default("CURRENT_TIMESTAMP"),
  restTime: integer("rest_time").notNull(), // rest between sets in seconds
})
