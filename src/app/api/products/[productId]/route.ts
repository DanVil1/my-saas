// src/app/api/products/[productId]/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server"; // Importa NextRequest
import { type Session } from "next-auth";

type CustomSession = Session & { user: { id: string } };

// Define un tipo explícito para el contexto de la ruta
interface RouteContext {
  params: {
    productId: string;
  };
}

// PATCH /api/products/[productId] - Para actualizar un producto
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const { productId } = context.params;

  if (!session || !session.user?.id) {
    return new NextResponse("No autenticado", { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, price } = body;

    const product = await prisma.product.updateMany({
      where: {
        id: productId,
        store: { ownerId: session.user.id },
      },
      data: {
        name,
        description,
        price: parseFloat(price),
      },
    });

    if (product.count === 0) {
      return new NextResponse("Producto no encontrado o no autorizado", { status: 404 });
    }

    return NextResponse.json({ message: "Producto actualizado" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

// DELETE /api/products/[productId] - Para borrar un producto
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const { productId } = context.params;

  if (!session || !session.user?.id) {
    return new NextResponse("No autenticado", { status: 401 });
  }

  try {
    const product = await prisma.product.deleteMany({
      where: {
        id: productId,
        store: { ownerId: session.user.id },
      },
    });

    if (product.count === 0) {
      return new NextResponse("Producto no encontrado o no autorizado", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error al borrar el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}