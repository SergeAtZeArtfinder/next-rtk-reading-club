import { hash } from "bcryptjs"

import type { Prisma } from "@prisma/client"

import { prisma } from "."

const books = [
  {
    title: "The Wise Man's Fear",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    description:
      "“There are three things all wise men fear: the sea in storm, a night with no moon, and the anger of a gentle man.”",
    images: [
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747296941/wisemansfear_1_dqntno.jpg",
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747296941/wisemansfear2_caitga.jpg",
    ],
    externalLink:
      "https://www.goodreads.com/book/show/1215032.The_Wise_Man_s_Fear",
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    description:
      "Told in Kvothe's own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.",
    images: [
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747297231/186074_ko4msc.jpg",
    ],
    externalLink:
      "https://www.goodreads.com/book/show/186074.The_Name_of_the_Wind",
  },
  {
    title: "Pride & Prejudice",
    author: "Jane Austen",
    genre: "Fiction",
    description:
      "Pride and Prejudice has charmed generations of readers for more than two centuries. Jane Austen's much-adapted novel is famed for its witty, spirited heroine, sensational romances, and deft remarks on the triumphs and pitfalls of social convention.",
    images: [
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747297431/129915654_ouijpz.jpg",
    ],
    externalLink:
      "https://www.goodreads.com/book/show/129915654-pride-prejudice",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.",
    images: [
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747297568/18144590_hivlnj.jpg",
    ],
    externalLink: "https://www.goodreads.com/book/show/18144590-the-alchemist",
  },
  {
    title: "The Girl With the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "Fiction",
    description:
      "Harriet Vanger, a scion of one of Sweden’s wealthiest families disappeared over forty years ago. All these years later, her aged uncle continues to seek the truth. He hires Mikael Blomkvist, a crusading journalist recently trapped by a libel conviction, to investigate.",
    images: [
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747297711/2429135_urodhw.jpg",
    ],
    externalLink:
      "https://www.goodreads.com/book/show/2429135.The_Girl_With_the_Dragon_Tattoo",
  },
  {
    title: "The Financier",
    author: "Theodore Dreiser",
    genre: "Fiction",
    description:
      "This powerful novel explores the dynamics of the financial world during the Civil War and after the stock-market panic caused by the Great Chicago Fire.",
    images: [
      "https://res.cloudinary.com/dyxroepux/image/upload/v1747297846/381364_pfigmo.jpg",
    ],
    externalLink: "https://www.goodreads.com/book/show/381364.The_Financier",
  },
]

const defaultPw = "Secret123"
const defaultImage =
  "https://res.cloudinary.com/dyxroepux/image/upload/v1747394229/icon-7797704_640_tpq01s.png"
const getUsersInput = async (): Promise<Prisma.UserCreateInput[]> => {
  const userData: Prisma.UserCreateInput[] = [
    {
      name: "John Doe",
      email: "j.doe@test.com",
      passwordHash: defaultPw,
      image: defaultImage,
    },
    {
      name: "Jane Doe",
      email: "jane.doe@test.com",
      passwordHash: defaultPw,
      image: defaultImage,
    },
    {
      name: "Johnny Pony",
      email: "johnny.pony@test.com",
      passwordHash: defaultPw,
      image: defaultImage,
    },
  ]
  const hashedUsers = await Promise.all(
    userData.map(async (user) => {
      const hashedPassword = await hash(user.passwordHash, 10)
      return {
        ...user,
        passwordHash: hashedPassword,
      }
    }),
  )

  return hashedUsers
}

const seedUsers = async () => {
  try {
    const users = await getUsersInput()
    await prisma.$transaction(async (tx) => {
      await tx.user.createMany({
        data: users,
      })
    })

    console.log("Users seeded successfully")
  } catch (error) {
    console.error("Error seeding users:", JSON.stringify(error, null, 2))
  }
}

const seedBooks = async () => {
  try {
    const allUsers = await prisma.user.findMany()

    const results = allUsers.map(async (user, index) => {
      const startIndex = index * 2
      const endIndex = startIndex + 2

      return await prisma.book.createMany({
        data: books.slice(startIndex, endIndex).map((book) => ({
          ...book,
          userId: user.id,
        })),
      })
    })

    await Promise.all(results)
    console.log("Books seeded successfully")
  } catch (error) {
    console.error("Error seeding books:", error)
  }
}

async function main() {
  await seedBooks()
}

main()
