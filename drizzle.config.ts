import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: "file:sqlite.db",
  },
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
})
