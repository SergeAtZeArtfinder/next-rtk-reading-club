"use client"

import React from "react"
import Link from "next/link"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react"

import { paths } from "@/lib/utils"
import Flame from "./Flame"

const MainNavigation = (): JSX.Element => {
  return (
    <Navbar isBordered aria-label="Main navigation">
      <NavbarBrand aria-label="Reading Clubb logo">
        <Link
          aria-label="Go to homepage"
          href={paths.home()}
          className="border border-default-200 rounded-xl p-2 min-w-[80px] flex gap-2 hover:bg-primary-100 transition-colors duration-200"
        >
          <span>RTK</span>
          <p className="font-bold text-inherit">🔜 POC</p>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
        aria-label="Main navigation page links"
      >
        <NavbarItem aria-label="Home page link" className="flex gap-6">
          <Flame /> Redux Toolkit POC
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default MainNavigation
