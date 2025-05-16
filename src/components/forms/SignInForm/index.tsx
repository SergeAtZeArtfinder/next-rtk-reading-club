"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
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

import { paths } from "@/lib/utils"
import { schemaLogin } from "@/lib/validation"
import AuthFormFooter from "../AuthFormFooter"
import EyeIconButton from "../EyeIconButton"

const SignInForm = (): JSX.Element => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const form = useForm<z.infer<typeof schemaLogin>>({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { isDirty, isLoading, isSubmitting } = form.formState
  const isSubmitDisabled = !isDirty || isLoading || isSubmitting
  const onSubmit = async (values: z.infer<typeof schemaLogin>) => {
    const res = await signIn("credentials", {
      ...values,
      redirect: true,
      callbackUrl: paths.home(),
    })

    res?.error &&
      addToast({
        title: "Login failed",
        description: res.error,
        color: "danger",
        timeout: 5000,
      })
  }
  return (
    <Card className="w-full max-w-lg mx-auto mt-10">
      <CardHeader className="flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4 font-bold">Sign In</h1>
        <p className="text-neutral-500">Welcome back to 📙 Book Clubb!</p>
      </CardHeader>
      <CardBody>
        <Form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            {...form.register("email")}
            label="Email"
            type="text"
            variant="bordered"
            errorMessage={form.formState.errors.email?.message}
            isInvalid={!!form.formState.errors.email}
          />
          <Input
            {...form.register("password")}
            label="Password"
            type={isPasswordVisible ? "text" : "password"}
            variant="bordered"
            errorMessage={form.formState.errors.password?.message}
            isInvalid={!!form.formState.errors.password}
            endContent={
              <EyeIconButton
                isVisible={isPasswordVisible}
                onClick={() => {
                  setIsPasswordVisible((current) => !current)
                }}
              />
            }
          />

          <Button
            isLoading={isSubmitting}
            isDisabled={isSubmitDisabled}
            fullWidth
            type="submit"
            color="secondary"
            className="disabled:opacity-75 disabled:cursor-not-allowed"
          >
            Login
          </Button>
          <Button
            onClick={() => {
              form.reset()
            }}
            isLoading={isSubmitting}
            isDisabled={isSubmitDisabled}
            fullWidth
            type="reset"
            color="secondary"
            variant="bordered"
            className="disabled:opacity-75 disabled:cursor-not-allowed"
          >
            Reset
          </Button>
        </Form>
      </CardBody>
      <CardFooter>
        <AuthFormFooter />
      </CardFooter>
    </Card>
  )
}

export default SignInForm
