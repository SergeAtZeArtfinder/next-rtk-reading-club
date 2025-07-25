import { ZodError } from "zod"

import type { Book as BookPrisma } from "@prisma/client"
import type { Book } from "@/types"

export const paths = {
  home: () => "/",
  about: {
    index: () => "/about",
    installSetup: () => "/about/install-setup",
    ssrPrefetch: () => "/about/ssr-prefetch",
    asyncThunkState: () => "/about/async-thunk-state",
    asyncThunkCancel: () => "/about/async-thunk-cancel",
    memoizedSelectors: () => "/about/state-memoized-selectors",
  },
  book: {
    create: () => "/book/create",
    edit: (bookId: string) => `/book/${bookId}/edit`,
  },
  signin: () => "/signin",
  signup: () => "/signup",
  art: (artworkId?: number) =>
    typeof artworkId !== "undefined" ? `/art/${artworkId}` : "/art",
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
