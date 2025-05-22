import type { Book as BookPrisma } from "@prisma/client"
import type { Book } from "@/types"

import { ZodError } from "zod"

export const paths = {
  home: () => "/",
  about: () => "/about",
  addBook: () => "/add-book",
  signin: () => "/signin",
  signup: () => "/signup",
}

export const formatErrorMessage = (
  error: unknown,
  defaultMessage = "An error occurred.",
) => {
  let message: string = defaultMessage

  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map(
      (err) => (err.path[0] ? `${err.path[0]}: ` : "") + err.message,
    )
    message = fieldErrors.join(". ")
  } else if (error instanceof Error) {
    message = error.message
  } else if (
    typeof error === "object" &&
    !!error &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    message = error.message
  }

  return message
}

export const formatBookDates = ({
  createdAt,
  updatedAt,
  ...rest
}: BookPrisma): Book => ({
  ...rest,
  createdAt: createdAt.toString(),
  updatedAt: updatedAt.toString(),
})
