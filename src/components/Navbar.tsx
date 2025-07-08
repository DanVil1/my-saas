// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation' // Import usePathname

export default function Navbar() {
  const pathname = usePathname() // Get the current URL path
  const { data: session, status } = useSession()

  // If we are on a store page, render nothing.
  if (pathname.startsWith('/store') || pathname.startsWith('/product')) {
    return null
  }

  // Otherwise, render the main app navbar
  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              MiSaaS
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600">
                  | Hola, {session.user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Registro</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}