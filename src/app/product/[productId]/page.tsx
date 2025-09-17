// src/app/product/[productId]/page.tsx
import { AddToCartButton } from '@/components/AddToCartButton';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ProductDetailPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto my-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* Placeholder for a product image */}
          <div className="bg-gray-200 w-full h-96 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Product Image</span>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
          {/* Futuro: Botón de "Añadir al Carrito" */}
          {/* 2. Add the button to the page */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}