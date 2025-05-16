"use client"

import React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react"

import { paths } from "@/lib/utils"
import ThemeSwitcher from "./ThemeSwitcher"
import UserMenu from "./UserMenu"

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
        {isLoggedIn && (
          <NavbarItem>
            <Link href={paths.addBook()}>add book</Link>
          </NavbarItem>
        )}
        <NavbarItem isActive>
          <Link href={paths.about()}>about</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitcher />
        {isLoggedIn ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <UserMenu user={session.user} />
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                color="secondary"
                variant="bordered"
                size="sm"
                href={paths.signin()}
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                color="secondary"
                variant="bordered"
                size="sm"
                href={paths.signup()}
              >
                Sign up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default MainNavigation
