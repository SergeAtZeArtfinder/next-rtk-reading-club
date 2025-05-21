"use client"

import React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Form,
  addToast,
} from "@heroui/react"

import type { Book } from "@prisma/client"
import {} from "@/types"

import { schemaCreateBook } from "@/lib/validation"

const mockAction = (
  values: z.infer<typeof schemaCreateBook>,
): Promise<
  { success: true; data: string } | { success: false; error: string }
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock action completed with values:", values)
      resolve({
        success: true,
        data: "Book created successfully",
      })
    }, 2000)
  })
}

interface Props {
  book?: Book
}

const BookForm = ({ book }: Props): JSX.Element => {
  const isUpdate = !!book
  const form = useForm<z.infer<typeof schemaCreateBook>>({
    resolver: zodResolver(schemaCreateBook),
    defaultValues: {
      title: book?.title || "",
      genre: book?.genre || "",
      author: book?.author || "",
      description: book?.description || "",
      externalLink: book?.externalLink || "",
      images: book?.images || [],
    },
  })

  const { isDirty, isLoading, isSubmitting } = form.formState
  const isSubmitDisabled = !isDirty || isLoading || isSubmitting
  const onSubmit = async (values: z.infer<typeof schemaCreateBook>) => {
    const res = await mockAction(values)
    if (res?.success) {
      addToast({
        title: "Success",
        description: res.data,
        color: "success",
        timeout: 5000,
      })
    } else {
      addToast({
        title: "Error",
        description: res.error || "Something went wrong",
        color: "danger",
        timeout: 5000,
      })
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto mt-10">
      <CardHeader className="flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4 font-bold">
          {isUpdate ? "Update your book" : "Add a new one"}
        </h1>
        <p className="text-neutral-500">
          Contribute something to the 📙 Book Clubb!
        </p>
      </CardHeader>
      <CardBody>
        <Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            {...form.register("title")}
            label="Title"
            placeholder="Enter the book title"
            required
          />
          <Input
            {...form.register("author")}
            label="Author"
            placeholder="Enter the author name"
            required
          />
          <Input
            {...form.register("genre")}
            label="Genre"
            placeholder="Enter the genre"
            required
          />
          <Input
            {...form.register("description")}
            label="Description"
            placeholder="Enter a short description"
            required
          />
          <Input
            {...form.register("externalLink")}
            label="External Link"
            placeholder="Enter an external link to the book"
          />
          <Button type="submit" disabled={isSubmitDisabled}>
            {isUpdate ? "Update Book" : "Add Book"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

export default BookForm
