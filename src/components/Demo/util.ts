export type User = {
  id: number
  name: string
  email: string
}

export const getUser = async () => {
  const res = await fetch("/user")
  return (await res.json()) as User
}

export const userLogin = async ({ username }: { username: string }) => {
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })

  return await res.json()
}
