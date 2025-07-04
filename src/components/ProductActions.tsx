// src/components/ProductActions.tsx
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ProductForm } from "./ProductForm"; // Reutilizaremos el formulario
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type Product } from "@prisma/client";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await fetch(`/api/products/${product.id}`, {
      method: 'DELETE',
    });
    setIsDeleting(false);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Botón de Editar que abre el ProductForm en modo edición */}
      <ProductForm productToEdit={product} />

      {/* Diálogo de Confirmación para Borrar */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">Borrar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto borrará permanentemente el producto {product.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Borrando..." : "Sí, borrar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}