"use client"

import React from "react"
import Link from "next/link"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react"

import { paths } from "@/lib/utils"
import ThemeSwitcher from "./ThemeSwitcher"

const MainNavigation = (): JSX.Element => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link
          href={paths.home()}
          className="border border-default-200 rounded-lg p-2 min-w-[80px] flex gap-2 hover:bg-primary-100 transition-colors duration-200"
        >
          <span>📙</span>
          <p className="font-bold text-inherit">Club</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href={paths.addBook()}>add book</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href={paths.about()}>about</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitcher />
        <NavbarItem className="hidden lg:flex">
          <Link href={paths.login()}>Login</Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href={paths.signup()}>Sign up</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default MainNavigation
