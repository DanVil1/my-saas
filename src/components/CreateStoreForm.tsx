// src/components/CreateStoreForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CreateStoreForm() {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, domain }),
      })
      if (res.ok) {
        router.refresh() // Refresca la página del dashboard para mostrar el nuevo estado
      } else {
        const data = await res.json()
        setError(data.message || 'Error al crear la tienda.')
      }
    } catch (err) {
      console.log(err)
      setError('Ocurrió un error inesperado.')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crea tu Tienda</CardTitle>
        <CardDescription>
          Dale un nombre a tu tienda para empezar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre de la Tienda</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="domain">Dominio (ej: mitienda)</Label>
            <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} required />
            <p className="text-sm text-gray-500">Tu tienda será accesible en: {domain || '[dominio]'}.misitioweb.com</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Crear Tienda</Button>
        </form>
      </CardContent>
    </Card>
  )
}