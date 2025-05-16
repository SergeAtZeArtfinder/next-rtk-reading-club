"use client"

import React from "react"
import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { ToastProvider } from "@heroui/toast"

import type { Session } from "next-auth"

interface Props {
  children: React.ReactNode
  session?: Session | null
}

const Providers = ({ children, session }: Props): JSX.Element => {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <SessionProvider session={session}>
          {children}
          <ToastProvider />
        </SessionProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  )
}

export default Providers
