import { z } from "zod"

export const fileSchema =
  typeof window !== "undefined" && typeof File !== "undefined"
    ? z.instanceof(File)
    : z.any()
export const filesSchema = z.array(fileSchema)

export const schemaLogin = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
})

export const schemaRegister = z
  .object({
    name: z.string().min(3, {
      message: "Name must be at least 3 characters long",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const schemaCreateBook = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  author: z.string().min(3, { message: "Author is required" }),
  description: z
    .string()
    .min(25, { message: "Description is required, 25 characters min" }),
  externalLink: z.string().url({ message: "Invalid URL" }),
  images: z.array(z.string().url({ message: "Invalid URL" })),
})
