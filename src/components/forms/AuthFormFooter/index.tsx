"use client"

import React from "react"
import Link from "next/link"
import { Alert, Button } from "@heroui/react"

import { paths } from "@/lib/utils"

interface Props {
  isRegister?: boolean
}

const AuthFormFooter = ({ isRegister }: Props): JSX.Element => {
  let content = "I already have an account? Sign me in >>>"
  let href = paths.signin()
  let linkText = "Sign in"
  if (!isRegister) {
    content = "I don't have an account? Sign me up >>>"
    href = paths.signup()
    linkText = "Sign up"
  }

  return (
    <div className="my-4 flex items-center justify-center w-full">
      <Alert
        color="secondary"
        description={content}
        endContent={
          <Button
            as={Link}
            href={href}
            color="secondary"
            size="sm"
            variant="flat"
          >
            {linkText}
          </Button>
        }
        variant="faded"
      />
    </div>
  )
}

export default AuthFormFooter
