import { compare } from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials" // Or any other provider
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import type { AuthOptions } from "next-auth"

import { getUserByEmail } from "@/lib/db/users"
import { schemaLogin } from "@/lib/validation"
import { paths } from "@/lib/utils"
import { prisma } from "@/lib/db"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const validation = schemaLogin.safeParse(credentials)
        if (!validation.success) {
          throw new Error("Invalid credentials")
        }

        const user = await getUserByEmail(validation.data.email)
        if (!user) {
          throw new Error("Invalid credentials")
        }
        const isPasswordMatch = await compare(
          validation.data.password,
          user.passwordHash,
        )
        if (!isPasswordMatch) throw new Error("Invalid credentials")

        const { id, name, email, image, emailVerified, role } = user

        return { id, name, email, image, emailVerified, role }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: paths.signin(),
    error: paths.signin(),
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.role = token.role as "USER" | "ADMIN"
      }

      return session
    },
    // https://next-auth.js.org/configuration/nextjs
  },
}
