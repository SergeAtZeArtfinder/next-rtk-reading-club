"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Form,
  addToast,
} from "@heroui/react"

import type { NextApiErrorResponse, NextApiSuccessResponse } from "@/types"

import { paths } from "@/lib/utils"
import { schemaRegister } from "@/lib/validation"
import { formatErrorMessage } from "@/lib/utils"
import EyeIconButton from "../EyeIconButton"

const SignupForm = (): JSX.Element => {
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const form = useForm<z.infer<typeof schemaRegister>>({
    resolver: zodResolver(schemaRegister),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const { isDirty, isLoading, isSubmitting } = form.formState
  const isSubmitDisabled = !isDirty || isLoading || isSubmitting

  const onSubmit = async (values: z.infer<typeof schemaRegister>) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      })

      if (!res.ok) {
        if (!res.ok) {
          const errorResponse: NextApiErrorResponse = await res.json()
          if (errorResponse.redirectPath) {
            addToast({
              title: "Registration failed",
              description: errorResponse.error,
              color: "danger",
              timeout: 5000,
            })
            router.push(errorResponse.redirectPath)
            return
          }
          throw new Error(errorResponse.error)
        }
      }

      const response: NextApiSuccessResponse<string> | NextApiErrorResponse =
        await res.json()
      if (response.success) {
        addToast({
          title: "Registration successful",
          description: response.data,
          color: "success",
          timeout: 5000,
        })
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: true,
          callbackUrl: paths.home(),
        })
      } else {
        addToast({
          title: "Registration failed",
          description: response.error,
          color: "danger",
          timeout: 5000,
        })
      }
    } catch (error) {
      const message = formatErrorMessage(error, "Registration failed")
      addToast({
        title: "Registration failed",
        description: message,
        color: "danger",
        timeout: 5000,
      })
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto mt-10">
      <CardHeader className="flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4 font-bold">Sign Up</h1>
        <p className="text-neutral-500">
          New Userrr 🎉 !!! Welcome to 📙 Book Clubb!
        </p>
      </CardHeader>
      <CardBody>
        <Form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            {...form.register("name")}
            label="Name"
            type="text"
            variant="bordered"
            errorMessage={form.formState.errors.name?.message}
            isInvalid={!!form.formState.errors.name}
          />
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
          <Input
            {...form.register("confirmPassword")}
            label="Confirm Password"
            type={isPasswordVisible ? "text" : "password"}
            variant="bordered"
            errorMessage={form.formState.errors.confirmPassword?.message}
            isInvalid={!!form.formState.errors.confirmPassword}
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
            color="warning"
            className="disabled:opacity-75 disabled:cursor-not-allowed"
          >
            Login
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

export default SignupForm
