import { prisma } from "."

export const getUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}
