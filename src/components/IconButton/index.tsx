"use client"

import React, { type ReactNode, ComponentProps } from "react"
import Link, { LinkProps } from "next/link"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface Props {
  href?: LinkProps["href"]
  children: ReactNode
  className?: string
  title?: string
  type?: ComponentProps<"button">["type"]
  disabled?: boolean
}

const IconButton = ({
  href,
  title,
  children,
  className,
  type,
  disabled,
}: Props) => {
  return !title ? (
    <Button
      type={type}
      asChild={!!href}
      variant="outline"
      size="icon"
      className={className}
      disabled={!href ? disabled : undefined}
    >
      {href ? <Link href={href}>{children}</Link> : <>{children}</>}
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type={type}
          asChild={!!href}
          variant="outline"
          size="icon"
          className={className}
          disabled={!href ? disabled : undefined}
        >
          {href ? <Link href={href}>{children}</Link> : <>{children}</>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default IconButton
