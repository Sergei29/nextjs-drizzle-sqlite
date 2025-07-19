"use client"

import React, { type ComponentProps } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import { Toaster } from "@/components/ui/sonner"

const ThemeProvider = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Toaster />
    </NextThemesProvider>
  )
}

export default ThemeProvider
