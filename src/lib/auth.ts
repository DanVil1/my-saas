// src/lib/auth.ts

import { type AuthOptions } from "next-auth"
import { type Adapter } from "next-auth/adapters"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma" // Usamos nuestra instancia central de Prisma

// NOTA: Ya no usamos 'export' aquí porque esta variable solo se usa en este archivo por ahora
// hasta que la exportemos al final.
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.password) {
          return null
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (isPasswordCorrect) {
          return user
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // <-- El error aquí debería desaparecer
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role; // <-- El error aquí debería desaparecer
      return session;
    },
},
  // --- FIN DEL BLOQUE A REEMPLAZAR ---
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}