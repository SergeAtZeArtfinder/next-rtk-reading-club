"use client"

import React from "react"
import { signOut } from "next-auth/react"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react"

import type { Session } from "next-auth"

interface Props {
  user: Session["user"]
}

const UserMenu = ({ user }: Props): JSX.Element => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="hover:bg-primary-100">
          Welcome {user.name} !!!
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
  )
}

export default UserMenu
