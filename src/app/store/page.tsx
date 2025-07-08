// src/app/store/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// This page reads a 'name' from the URL search parameters, like /store?name=admin
export default async function StorePage({
  searchParams,
}: {
  searchParams: { name: string };
}) {
  const storeDomain = searchParams.name;

  if (!storeDomain) {
    notFound();
  }

  const store = await prisma.store.findUnique({
    where: {
      domain: storeDomain,
    },
    include: {
      products: true, // Also fetch all products for this store
    },
  });

  // If no store is found with that domain, show a 404 page
  if (!store) {
    notFound();
  }

  // If the store is found, display it
return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-4xl font-bold text-gray-900">{store.name}</h1>
        </div>
      </header>
      <main className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Envolvemos cada Card en un componente Link */}
          {store.products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description || ""}
                  </p>
                  <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {store.products.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            This store has no products yet.
          </p>
        )}
      </main>
    </div>
  );
}