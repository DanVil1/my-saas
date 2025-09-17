// src/app/order/success/page.tsx
'use client'

// THIS IS THE ONLY LINE YOU NEED TO ADD TO YOUR ORIGINAL CODE
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const storeName = searchParams.get('store') || 'admin';
    
    return (
        <div className="container mx-auto py-20 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">¡Pago Iniciado!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Revisa tu celular para aprobar el pago con Nequi.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Una vez apruebes el pago, recibirás una confirmación por email.
                    </p>
                    <Link href={`/store?name=${storeName}`}>
                        <Button className="w-full">Volver a la tienda</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}