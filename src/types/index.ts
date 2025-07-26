export type PageProps<
  P = Record<string, string>,
  Q = Record<string, string>,
> = {
  params: Promise<P>
  searchParams: Promise<Q>
}

export type AsyncState<D> = {
  isLoading: boolean
  data: D | null
  error: string | null
}

export type ServerActionReturn<D> =
  | {
      success: true
      data: D
    }
  | {
      success: false
      errors: Record<string, string>[]
    }

export type WorkoutSummary = {
  id: number
  name: string
  createdAt: string | null
  updatedAt: string | null
  description: string | null
  restTime: number
  sets: {
    id: number
    name: string | null
    setOrder: number
  }[]
}
