import bcrypt from "bcryptjs"

import type { NextApiRequest, NextApiResponse } from "next"
import type { NextApiErrorResponse, NextApiSuccessResponse } from "@/types"

import { prisma } from "@/lib/db"
import { schemaRegister } from "@/lib/validation"
import { formatErrorMessage, paths } from "@/lib/utils"

export default async function handleRegister(
  req: NextApiRequest,
  res: NextApiResponse<NextApiErrorResponse | NextApiSuccessResponse<string>>,
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed")
  const validation = schemaRegister.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error.errors.map((e) => e.message).join(", "),
    })
  }

  try {
    const { name, email, password } = validation.data
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
        redirectPath: paths.signin(),
      })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    return res
      .status(201)
      .json({ success: true, data: "User created successfully" })
  } catch (error) {
    const message = formatErrorMessage(error, "Registration failed")
    return res.status(500).json({ success: false, error: message })
  }
}
