"use client"

import React, { type HTMLAttributes } from "react"
import { usePathname } from "next/navigation"
import Link, { type LinkProps } from "next/link"

import { cn } from "@/lib/utils"

const NavLink = ({
  children,
  className,
  href,
  ...restLinkProps
}: LinkProps & Pick<HTMLAttributes<"a">, "children" | "className">) => {
  const pathname = usePathname()

  return (
    <Link
      className={cn(
        className,
        pathname === href && "pointer-events-none underline",
      )}
      href={href}
      {...restLinkProps}
    >
      {children}
    </Link>
  )
}

export default NavLink
