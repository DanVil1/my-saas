// src/app/order/success/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react"; // Import a loading icon
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"; // 1. Import Suspense from React

// 2. We create a new component that contains the dynamic logic
function SuccessContent() {
    const searchParams = useSearchParams();
    
    // Note: We need a way to pass the actual store name here in the future.
    // For now, this fallback will work.
    const storeName = searchParams.get('store') || 'admin';
    
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl">¡Pago Iniciado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    Revisa la notificación en tu celular para aprobar el pago con Nequi.
                </p>
                <p className="text-sm text-muted-foreground">
                    Una vez apruebes el pago, recibirás una confirmación.
                </p>
                <Link href={`/store?name=${storeName}`}>
                    <Button className="w-full">Volver a la tienda</Button>
                </Link>
            </CardContent>
        </Card>
    );
}

// A simple component to show while Suspense is waiting
function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Cargando confirmación...</p>
        </div>
    )
}

// 3. Your main page component now wraps the dynamic part in Suspense
export default function OrderSuccessPage() {
    return (
        <div className="container mx-auto py-20 text-center">
            <Suspense fallback={<LoadingState />}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}