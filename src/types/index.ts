export type PageProps<
  P = Record<string, string>,
  Q = Record<string, string>,
> = {
  params: Promise<P>
  searchParams: Promise<Q>
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
