// types/next-auth.d.ts
import { type DefaultUser } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import { type UserRole } from "@prisma/client";

// 1. Extendemos el tipo del Token (JWT)
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}

// 2. Extendemos el tipo del Usuario y la Sesión
declare module "next-auth" {
  // Extendemos el tipo User para que coincida con nuestro modelo de Prisma
  interface User extends DefaultUser {
    role: UserRole;
  }

  // Extendemos la Sesión para que el objeto `user` dentro de ella tenga nuestros campos personalizados
  interface Session {
    user: User & {
      id: string;
    };
  }
}