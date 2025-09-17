// src/components/AddToCartButton.tsx
'use client'

import { useCart } from "@/context/CartContext"
import { type Product } from "@prisma/client"
import { Button } from "./ui/button"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  return (
    <Button onClick={() => addToCart(product)}>
      Añadir al Carrito
    </Button>
  )
}