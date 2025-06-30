// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar"; // <-- 1. Importa el Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiSaaS",
  description: "La mejor solución",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> {/* <-- 2. Añade el Navbar aquí */}
          <main>{children}</main> {/* Opcional: envuelve children en un main */}
        </AuthProvider>
      </body>
    </html>
  );
}