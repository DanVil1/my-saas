// src/components/Cart.tsx
'use client'

import { useCart } from "@/context/CartContext"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function Cart() {
  const { cartItems, removeFromCart } = useCart()

  // Calculate total number of items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tu Carrito de Compras</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      X
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <SheetFooter className="mt-4">
            <div className="w-full">
                <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
{/* 2. Wrap the Button with Link */}
                <Button className="w-full" asChild>
                    <Link href="/checkout">Ir al Checkout</Link>
                </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}