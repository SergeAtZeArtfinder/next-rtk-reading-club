import "next-auth"
import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User extends DefaultSession["user"] {
    id: string
    name: string | null
    email: string
    image: string | null
    role: Role
  }
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
      role: Role
    }
  }
}
