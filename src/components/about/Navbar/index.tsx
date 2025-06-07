"use client"

import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Button } from "@heroui/react"
import clsx from "clsx"

import { paths } from "@/lib/utils"

const navLinks = [
  {
    id: 1,
    href: paths.about.index(),
    label: "About intro",
  },
  {
    id: 2,
    href: paths.about.installSetup(),
    label: "RTK Install & Setup",
  },
  {
    id: 3,
    href: paths.about.ssrPrefetch(),
    label: "SSR Prefetch",
  },
  {
    id: 4,
    href: paths.about.asyncThunkState(),
    label: "Async Thunk State",
  },

  {
    id: 5,
    href: paths.about.asyncThunkCancel(),
    label: "Async Thunk Cancel",
  },
]

const Navbar = (): JSX.Element => {
  const router = useRouter()

  return (
    <nav className="my-8" aria-label="About navigation">
      <ul className="flex gap-2" aria-label="About navigation links">
        {navLinks.map((link) => (
          <li key={link.id} aria-label={`About ${link.label}`}>
            <Button
              as={Link}
              size="sm"
              variant="bordered"
              color="secondary"
              href={link.href}
              className={clsx({
                "bg-orange-500": router.pathname === link.href,
                "text-black": router.pathname === link.href,
              })}
            >
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
