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
    <Navbar isBordered aria-label="Main navigation">
      <NavbarBrand aria-label="Reading Clubb logo">
        <Link
          aria-label="Go to Reading Clubb homepage"
          href={paths.home()}
          className="border border-default-200 rounded-xl p-2 min-w-[80px] flex gap-2 hover:bg-primary-100 transition-colors duration-200"
        >
          <span>📙 ← 👁️</span>
          <p className="font-bold text-inherit">Clubb</p>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
        aria-label="Main navigation page links"
      >
        {isLoggedIn && (
          <NavbarItem aria-label="Add new Book page link">
            <Link href={paths.book.create()}>add book</Link>
          </NavbarItem>
        )}
        <NavbarItem isActive aria-label="About Redux RTK page link">
          <Link href={paths.about.index()}>about</Link>
        </NavbarItem>

        <NavbarItem aria-label="View Artworks">
          <Link href={paths.art()}>artworks</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" aria-label="Main navigation user actions">
        <NavbarItem aria-label="Toggle theme switcher Dark/Light">
          <ThemeSwitcher />
        </NavbarItem>
        {isLoggedIn ? (
          <>
            <NavbarItem
              className="hidden lg:flex"
              aria-label="User options menu"
            >
              <UserMenu user={session.user} />
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem
              className="hidden lg:flex"
              aria-label="Login and Sign up buttons"
            >
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
