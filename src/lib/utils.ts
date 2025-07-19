import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const paths = {
  home: () => "/",
  workouts: (slug?: string | number) =>
    slug ? `/workouts/${slug}` : "/workouts",
  sets: (slug?: string | number) => (slug ? `/sets/${slug}` : "/sets"),
  exercises: (slug?: string | number) =>
    slug ? `/exercises/${slug}` : "/exercises",
}

export const getErrorMessage = (error: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return error instanceof Error ? error.message : (error as any).toString()
}
