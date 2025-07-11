"use client"

import React, { useEffect, useState } from "react"

import { getUser, type User } from "./util"

const Demo = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getUser()
        setUser(data)
        setIsLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch user")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <p>Loading</p>
  }
  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h4>{user?.name}</h4>
      <p>{user?.email}</p>
    </div>
  )
}

export default Demo
