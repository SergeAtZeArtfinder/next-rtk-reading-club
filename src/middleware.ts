import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"

import { paths } from "@/lib/utils"

const AUTH_ROUTES = [paths.signin(), paths.signup()]
const USER_ROUTES = [paths.book.create(), paths.book.edit(":bookId")]

export default withAuth(
  function middleware(req) {
    const { pathname, origin } = req.nextUrl
    const isAuthenticated = req.nextauth.token
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
    const isUserRoute = USER_ROUTES.some((route) => pathname.startsWith(route))

    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL(paths.home(), origin))
    }

    if (!isAuthenticated && isUserRoute) {
      return NextResponse.redirect(new URL(paths.signin(), origin))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Optionally, you can further restrict access here
      authorized({ token, req }) {
        // Return true to allow, false to block
        return true
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
