"use client"

import React from "react"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react"
import Link from "next/link"

const MainNavigation = (): JSX.Element => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link
          href="/"
          className="border border-default-200 rounded-lg p-2 min-w-[80px] flex gap-2 hover:bg-slate-50"
        >
          <span>📙</span>
          <p className="font-bold text-inherit">Club</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/add-book">add book</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/about">about</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="/signup">Sign up</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default MainNavigation
