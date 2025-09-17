// src/app/checkout/page.tsx
'use client'

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Script from "next/script";

declare const $wompi: any;

export default function CheckoutPage() {
    const { cartItems, totalPrice } = useCart();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('NEQUI');

    // --- NEW: State for the Nequi phone number ---
    const [nequiPhoneNumber, setNequiPhoneNumber] = useState('');

    useEffect(() => {
        const onWompiLoad = () => {
            $wompi.initialize((data: any, error: any) => {
                if (error === null) setSessionId(data.sessionId);
                else console.error("Wompi JS Error:", error);
            });
        };
        if (typeof $wompi !== 'undefined') onWompiLoad();
        else document.querySelector('script[src^="https://wompijs.wompi.com"]')?.addEventListener('load', onWompiLoad);
        return () => {
            document.querySelector('script[src^="https://wompijs.wompi.com"]')?.removeEventListener('load', onWompiLoad);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) {
            alert("El sistema de seguridad de pagos no ha cargado. Por favor, espere y reintente.");
            return;
        }
        setLoading(true);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: { name, email },
                    items: cartItems,
                    total: totalPrice,
                    sessionId: sessionId,
                    paymentMethod: paymentMethod,
                    nequiPhoneNumber: nequiPhoneNumber, // --- NEW: Send the phone number ---
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create transaction");
            
            // For Nequi push payments, the redirect happens after approval in the app.
            // We can redirect to the success page immediately to show a "Check your phone" message.
            window.location.href = `/order/success`;

        } catch (error) {
            console.error("Failed to initiate payment:", error);
            alert(`Error: No se pudo iniciar el proceso de pago. ${error instanceof Error ? error.message : ''}`);
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
            </div>
        )
    }

    return (
        <>
            <Script 
                src="https://wompijs.wompi.com/libs/js/v1.js"
                data-public-key={process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}
            />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div>
                        <Card>
                            <CardHeader><CardTitle>Resumen del Pedido</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p></div>
                                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Customer Information and Payment Form */}
                    <div>
                        <Card>
                            <CardHeader><CardTitle>Tus Datos y Método de Pago</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre Completo</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                                    </div>
                                    <div className="border rounded-md p-4">
                                        <Label>Pagar con Nequi</Label>
                                        {/* --- NEW: Input for Nequi Phone Number --- */}
                                        <div className="mt-2">
                                            <Label htmlFor="nequi" className="text-sm text-muted-foreground">Número de celular</Label>
                                            <Input 
                                                id="nequi" 
                                                type="tel" 
                                                placeholder="3001234567"
                                                value={nequiPhoneNumber}
                                                onChange={(e) => setNequiPhoneNumber(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading || !sessionId}>
                                        {loading ? "Procesando..." : (sessionId ? `Pagar ${totalPrice.toFixed(2)} con Nequi` : "Cargando seguridad...")}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}