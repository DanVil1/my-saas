// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma' // Asegúrate de usar la instancia central
import { CreateStoreForm } from '@/components/CreateStoreForm'
import { type Session } from "next-auth" // <-- 1. Importa el tipo Session
import { ProductDashboard } from '@/components/ProductDashboard'

// 2. Define el mismo tipo personalizado
type CustomSession = Session & {
    user: {
        id: string;
    };
};

export default async function DashboardPage() {
  // 3. FUERZA el tipo de la sesión
  const session = await getServerSession(authOptions) as CustomSession | null

  if (!session || !session.user?.id) {
    redirect('/login')
  }

 const store = await prisma.store.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <CreateStoreForm />
      </div>
    );
  }

  // Si ya tiene una tienda, muestra el dashboard de productos
  return (
    <div className="container mx-auto py-10">
      <ProductDashboard storeId={store.id} />
    </div>
  );
}