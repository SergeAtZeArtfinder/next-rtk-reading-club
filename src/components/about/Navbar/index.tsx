"use client"

import React from "react"
import { Card, CardBody, Code, Button } from "@heroui/react"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

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
]

const Navbar = (): JSX.Element => {
  const router = useRouter()

  return (
    <nav className="my-8">
      <ul className="flex gap-2">
        {navLinks.map((link) => (
          <li key={link.id}>
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
