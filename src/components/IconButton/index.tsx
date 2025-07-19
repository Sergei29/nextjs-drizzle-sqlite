"use client"

import React, { type ReactNode } from "react"
import Link, { LinkProps } from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface Props {
  href: LinkProps["href"]
  children: ReactNode
  className?: string
  title?: string
}

const IconButton = ({ href, title, children, className }: Props) => {
  return !title ? (
    <Button asChild variant="outline" size="icon" className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="outline" size="icon" className={className}>
          <Link href={href}>{children}</Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default IconButton
