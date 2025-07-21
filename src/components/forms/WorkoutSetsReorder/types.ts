import { getSetsBy } from "@/lib/actions/sets"

export type SetsState = {
  isLoading: boolean
  error: null | string
  data: Awaited<ReturnType<typeof getSetsBy>>
}
