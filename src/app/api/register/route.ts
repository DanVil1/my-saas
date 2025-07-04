// src/app/api/register/route.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return new NextResponse('Faltan datos', { status: 400 })
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (exist) {
      return new NextResponse('El usuario ya existe', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}