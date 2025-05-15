import { Book } from "@/types"

const books = [
  {
    id: "1",
    title: "The Wise Man's Fear",
    author: "Patrick Rothfuss",
    genre: "Fiction",
    description:
      "“There are three things all wise men fear: the sea in storm, a night with no moon, and the anger of a gentle man.”",
    images: [
      "/public/images/wisemansfear_1.jpeg",
      "/public/images/wisemansfear2.jpg",
    ],
  },
]

export const getAllBooks = (): Promise<Book[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books)
    }, 1000)
  })
}
