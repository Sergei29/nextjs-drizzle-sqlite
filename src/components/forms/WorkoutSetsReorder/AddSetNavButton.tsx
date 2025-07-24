"use client"

import React, { type ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { paths } from "@/lib/utils"

interface Props {
  workoutId: number
  pathname: string
  children: ReactNode
  className?: string
}

const AddSetNavButton = ({
  children,
  workoutId,
  pathname,
  className,
}: Props) => {
  return (
    <Button asChild className={className}>
      <Link
        href={{
          pathname: paths.sets(`create`),
          query: {
            workoutId,
            callbackUrl: pathname,
          },
        }}
      >
        {children}
      </Link>
    </Button>
  )
}

export default AddSetNavButton
