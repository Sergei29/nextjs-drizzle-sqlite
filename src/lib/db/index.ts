import { drizzle } from "drizzle-orm/libsql/web"

const db = drizzle({
  connection: {
    url: "file:./sqlite.db",
  },
})

export { db }
