import type { Book } from "@/types"

const getBookSchema = (book: Book) => ({
  "@context": "https://schema.org",
  "@type": "Book",
  name: book.title,
  author: {
    "@type": "Person",
    name: book.author,
  },
  genre: book.genre,
  description: book.description,
  url: book.externalLink,
  image: book.images?.[0] || undefined,
})

export const getJsonSchema = ({ books }: { books: Book[] }) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Homepage | Reading Clubb",
    url: "https://my-reading-clubb.vercel.app/",
    description:
      "Reading Clubb is a curated platform showcasing a diverse collection of books... Join our Reading Clubb to discover, share, and explore users' favorite books. Track your reading journey, connect with fellow book lovers, and find your next great read!",
  }

  return [baseSchema, ...books.map(getBookSchema)]
}
