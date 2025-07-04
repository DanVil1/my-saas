// src/components/ProductDashboard.tsx
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductForm } from "./ProductForm";
import { ProductActions } from "./ProductActions";
import { Card } from "./ui/card";

interface ProductDashboardProps {
  storeId: string;
}

export async function ProductDashboard({ storeId }: ProductDashboardProps) {
  const products = await prisma.product.findMany({
    where: { storeId: storeId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tus Productos</h2>
        <ProductForm />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* La lógica condicional ahora está dentro del TableBody sin espacios extra */}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Aún no has añadido ningún producto.
                </TableCell>
              </TableRow>
            )}
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <ProductActions product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}