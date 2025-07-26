"use client"

import React, { type ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { paths } from "@/lib/utils"

interface Props {
  setId?: number
  pathname: string
  children: ReactNode
  className?: string
}

const AddNewExerciseButton = ({
  children,
  setId,
  pathname,
  className,
}: Props) => {
  return (
    <Button asChild className={className}>
      <Link
        href={{
          pathname: paths.exercises("create"),
          query: {
            setId,
            callbackUrl: pathname,
          },
        }}
      >
        {children}
      </Link>
    </Button>
  )
}

export default AddNewExerciseButton
