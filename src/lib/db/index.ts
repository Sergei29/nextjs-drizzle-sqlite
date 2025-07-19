import { drizzle } from "drizzle-orm/libsql"
import * as schema from "@drizzle/schema"

const db = drizzle({
  connection: {
    url: "file:./sqlite.db",
  },
  schema,
})

export { db }
