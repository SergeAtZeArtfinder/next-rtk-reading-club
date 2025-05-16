"use client"

import React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react"

import { paths } from "@/lib/utils"
import ThemeSwitcher from "./ThemeSwitcher"

const MainNavigation = (): JSX.Element => {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link
          href={paths.home()}
          className="border border-default-200 rounded-xl p-2 min-w-[80px] flex gap-2 hover:bg-primary-100 transition-colors duration-200"
        >
          <span>📙 ← 👁️</span>
          <p className="font-bold text-inherit">Clubb</p>
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
        {isLoggedIn ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="hover:bg-primary-100">
                    Welcome {session.user.name} !!!
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="new"
                    onClick={() => {
                      signOut()
                    }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href={paths.signin()}>Login</Link>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Link href={paths.signup()}>Sign up</Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default MainNavigation
