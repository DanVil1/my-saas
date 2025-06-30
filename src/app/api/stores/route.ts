// src/app/api/stores/route.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma' // Asegúrate de usar la instancia central
import { NextResponse } from "next/server"
import { type Session } from "next-auth" // <-- 1. Importa el tipo Session

// 2. Define un tipo personalizado que INCLUYA nuestro 'id'
type CustomSession = Session & {
    user: {
        id: string;
    };
};

export async function POST(request: Request) {
  // 3. FUERZA el tipo de la sesión a nuestro tipo personalizado
  const session = await getServerSession(authOptions) as CustomSession | null

  // Ahora TypeScript ya no se quejará de la siguiente línea
  if (!session || !session.user?.id) {
    return new NextResponse('No autenticado', { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, domain } = body

    if (!name || !domain) {
      return new NextResponse('Faltan datos', { status: 400 })
    }

    const store = await prisma.store.create({
      data: {
        name,
        domain,
        ownerId: session.user.id, // <-- Esta línea ahora es válida para TypeScript
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error("Error al crear la tienda:", error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}