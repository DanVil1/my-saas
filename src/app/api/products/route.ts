// src/app/api/products/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type Session } from "next-auth";

type CustomSession = Session & { user: { id: string } };

// POST /api/products - Para crear un nuevo producto
export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  if (!session || !session.user?.id) {
    return new NextResponse("No autenticado", { status: 401 });
  }

  // Primero, encontramos la tienda del usuario
  const store = await prisma.store.findFirst({
    where: { ownerId: session.user.id },
  });

  if (!store) {
    return new NextResponse("No se encontró la tienda del usuario", { status: 404 });
  }

  try {
    const body = await request.json();
    const { name, description, price } = body;

    if (!name || !price) {
      return new NextResponse("Faltan el nombre o el precio", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        storeId: store.id, // Asociamos el producto a la tienda del usuario
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}