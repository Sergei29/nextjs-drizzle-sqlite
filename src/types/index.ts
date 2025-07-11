export type PageProps<
  P = Record<string, string>,
  Q = Record<string, string>,
> = {
  params: Promise<P>
  searchParams: Promise<Q>
}
