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
