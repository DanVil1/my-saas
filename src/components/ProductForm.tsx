// src/components/ProductForm.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { type Product } from '@prisma/client';

interface ProductFormProps {
  productToEdit?: Product; // Prop opcional para el modo edición
}

export function ProductForm({ productToEdit }: ProductFormProps) {
  const isEditMode = !!productToEdit;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isEditMode) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price.toString());
    }
  }, [productToEdit, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isEditMode ? `/api/products/${productToEdit.id}` : '/api/products';
    const method = isEditMode ? 'PATCH' : 'POST';

    const res = await fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price }),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el producto.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="outline" size="sm">Editar</Button>
        ) : (
          <Button>Añadir Producto</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Modifica los detalles de tu producto.' : 'Rellena los detalles de tu nuevo producto.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Descripción</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Precio</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" required />
          </div>
          {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit">{isEditMode ? 'Guardar Cambios' : 'Guardar Producto'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}