"use client"

import React from "react"
import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface Props {
  children: React.ReactNode
}

const Providers = ({ children }: Props): JSX.Element => {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}

export default Providers
