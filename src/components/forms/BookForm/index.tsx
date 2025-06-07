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
import { MdDeleteOutline } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useRouter } from "next/router"

import type { AppDispatch } from "@/lib/redux/store"
import type { Book } from "@/types"

import { useUploadedImages } from "@/lib/hooks/useUploadImages"
import { postNewBook, editBook } from "@/lib/redux/slices/booksSlice"
import { schemaCreateBook } from "@/lib/validation"

interface Props {
  book?: Book
}

const BookForm = ({ book }: Props): JSX.Element => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
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

  const isUpdate = !!book
  const { isLoading, isSubmitting } = form.formState
  const isSubmitDisabled = isLoading || isSubmitting
  const images = form.watch("images")

  const onSubmit = async (values: z.infer<typeof schemaCreateBook>) => {
    if (isSubmitting || isLoading) return
    if (isUpdate) {
      // If we are updating an existing book, we need to include the bookId
      const input = {
        ...values,
        bookId: book?.id || "",
      }
      const updateAction = await dispatch(editBook(input))

      if (editBook.fulfilled.match(updateAction)) {
        addToast({
          title: "Success",
          description: "Book updated successfully",
          color: "success",
          timeout: 2000,
        })
        router.push("/")
      } else {
        addToast({
          title: "Error",
          description: updateAction.payload || "Something went wrong",
          color: "danger",
          timeout: 2000,
        })
      }
    } else {
      // If we are creating a new book, we just dispatch the postNewBook action
      /**
       * @description To handle post-submit logic (like navigation or showing a toast)
       * after dispatching a Redux async thunk, you should await
       * the dispatch and check the result using the returned action’s meta
       * and payload properties.
       */
      const createAction = await dispatch(postNewBook(values))

      if (postNewBook.fulfilled.match(createAction)) {
        addToast({
          title: "Success",
          description: "Book created successfully",
          color: "success",
          timeout: 2000,
        })
        router.push("/")
      } else {
        addToast({
          title: "Error",
          description: createAction.payload || "Something went wrong",
          color: "danger",
          timeout: 2000,
        })
      }
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
                  <li
                    key={index}
                    className="flex items-center justify-center gap-2 relative bg-black/50 rounded-lg"
                  >
                    <Image
                      src={image}
                      alt={`Uploaded image ${index}`}
                      className="rounded-lg object-contain"
                    />
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
                      className="absolute top-2 right-2 z-20 disabled:bg-gray-500 px-2"
                      disabled={isUploading}
                      startContent={<MdDeleteOutline size={24} />}
                      size="sm"
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
