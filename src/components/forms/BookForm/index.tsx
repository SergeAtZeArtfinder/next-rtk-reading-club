"use client"

import React, { useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Form,
  addToast,
  Image,
  Textarea,
} from "@heroui/react"
import { FaBook } from "react-icons/fa"

import type { Book } from "@prisma/client"

import { useUploadedImages } from "@/lib/hooks/useUploadImages"
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
  const { isUploading, handleUploadImage, handleDeleteImage } =
    useUploadedImages()
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { isDirty, isLoading, isSubmitting } = form.formState
  const isSubmitDisabled = !isDirty || isLoading || isSubmitting
  const images = form.watch("images")

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
            isInvalid={!!form.formState.errors.title}
            errorMessage={form.formState.errors.title?.message}
          />
          <Input
            {...form.register("author")}
            label="Author"
            placeholder="Enter the author name"
            required
            isInvalid={!!form.formState.errors.author}
            errorMessage={form.formState.errors.author?.message}
          />
          <Input
            {...form.register("genre")}
            label="Genre"
            placeholder="Enter the genre"
            required
            isInvalid={!!form.formState.errors.genre}
            errorMessage={form.formState.errors.genre?.message}
          />
          <Textarea
            {...form.register("description")}
            label="Description"
            placeholder="Enter a short description"
            required
            isInvalid={!!form.formState.errors.description}
            errorMessage={form.formState.errors.description?.message}
            rows={4}
          />
          <Input
            {...form.register("externalLink")}
            label="External Link"
            placeholder="Enter an external link to the book"
            required
            isInvalid={!!form.formState.errors.externalLink}
            errorMessage={form.formState.errors.externalLink?.message}
          />

          <Card fullWidth>
            <CardHeader>
              <h2 className="text-lg font-bold">Upload Images</h2>
            </CardHeader>
            <CardBody>
              <Input
                type="file"
                ref={fileInputRef}
                startContent={<FaBook />}
                placeholder="Upload book cover or images"
                onChange={async (event) => {
                  const selectedFiles = Array.from(event.target.files || [])
                  await handleUploadImage({
                    files: selectedFiles,
                    onSuccess(imageUrls) {
                      form.setValue("images", [
                        ...form.getValues("images"),
                        ...imageUrls,
                      ])
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    },
                  })
                }}
                disabled={isUploading}
              />

              <ul className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <li key={index} className="flex items-center gap-2 relative">
                    <Image src={image} alt={`Uploaded image ${index}`} />
                    <Button
                      onPress={() =>
                        handleDeleteImage({
                          src: image,
                          onSuccess(publicId) {
                            form.setValue(
                              "images",
                              images.filter((img) => !img.includes(publicId)),
                            )
                          },
                        })
                      }
                      color="danger"
                      className="absolute top-2 right-2 z-20"
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Button type="submit" disabled={isSubmitDisabled}>
            {isUpdate ? "Update Book" : "Add Book"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

export default BookForm
