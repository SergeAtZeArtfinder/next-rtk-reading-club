// pages/api/auth/[...nextauth].ts
import { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials" // Or any other provider
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { getUserByEmail } from "@/lib/db/users"
import { schemaLogin } from "@/lib/validation"
import { prisma } from "@/lib/db" // We'll define this
import { compare } from "bcrypt"

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
    signIn: "/signin", // Optional custom sign-in
  },
}
