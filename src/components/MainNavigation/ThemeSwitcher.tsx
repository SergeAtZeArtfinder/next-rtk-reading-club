"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Tooltip } from "@heroui/react"
import clsx from "clsx"

const ThemeSwitcher = (): JSX.Element | null => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Tooltip
      content={theme === "dark" ? "light theme" : "dark theme"}
      placement="bottom"
    >
      <button
        className={clsx(
          "bg-gradient-to-tr from-pink-500  text-white shadow-lg rounded-full p-1 w-6 h-6 flex items-center justify-center hover:scale-105 transition-transform duration-200",
          theme === "dark" ? "to-yellow-500" : "to-blue-500",
        )}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"}`}
      >
        {theme === "light" ? <span>☾</span> : <span>☀️</span>}
      </button>
    </Tooltip>
  )
}

export default ThemeSwitcher
