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
  },
]

const seedBooks = async () => {
  try {
    await prisma.book.createMany({
      data: books,
    })
    console.log("Books seeded successfully")
  } catch (error) {
    console.error("Error seeding books:", error)
  }
}

async function main() {
  await seedBooks()
}

main()
