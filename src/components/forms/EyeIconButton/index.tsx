"use client"

import React, { type ComponentProps } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import clsx from "clsx"

interface Props extends Omit<ComponentProps<"button">, "children" | "ref"> {
  isVisible: boolean
}

const EyeIconButton = ({ isVisible, className, ...restButtonProps }: Props) => (
  <button
    type="button"
    className={clsx("focus:outline-none m-auto", className)}
    {...restButtonProps}
  >
    {isVisible ? (
      <IoMdEye
        size={25}
        className="text-2xl text-default-400 pointer-events-none"
      />
    ) : (
      <IoMdEyeOff
        size={25}
        className="text-2xl text-default-400 pointer-events-none"
      />
    )}
  </button>
)

export default EyeIconButton
