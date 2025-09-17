// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { type CartItem } from "@/context/CartContext";
import { nanoid } from "nanoid";
import { createHash } from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // --- NEW: Receive nequiPhoneNumber ---
        const { customer, items, total, sessionId, paymentMethod, nequiPhoneNumber } = body;

        if (!customer || !items || !total || !sessionId || !paymentMethod || (paymentMethod === 'NEQUI' && !nequiPhoneNumber)) {
            return new NextResponse("Missing data", { status: 400 });
        }

        const merchantResponse = await fetch(`https://sandbox.wompi.co/v1/merchants/${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`);
        const merchantData = await merchantResponse.json();
        const acceptanceToken = merchantData.data.presigned_acceptance.acceptance_token;

        const storeId = items[0]?.storeId;
        if (!storeId) return new NextResponse("Cart is invalid", { status: 400 });
        
        // Get store name for redirect
        const store = await prisma.store.findUnique({ where: { id: storeId } });
        const storeName = store?.name || 'admin';

        const reference = nanoid(10);
        const amountInCents = total * 100;
        const currency = "COP";
        const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
        const concatenation = `${reference}${amountInCents}${currency}${integrityKey}`;
        const signature = createHash('sha256').update(concatenation).digest('hex');

        await prisma.order.create({
            data: {
                storeId: storeId, isPaid: false, reference: reference,
                customerName: customer.name, customerEmail: customer.email,
                orderItems: {
                    create: items.map((item: CartItem) => ({
                        productId: item.id, quantity: item.quantity,
                    })),
                },
            },
        });

        // --- NEW: Build the complete payment_method object for Nequi ---
        const wompiResponse = await fetch("https://sandbox.wompi.co/v1/transactions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
            },
            body: JSON.stringify({
                acceptance_token: acceptanceToken,
                amount_in_cents: amountInCents,
                currency: currency,
                customer_email: customer.email,
                payment_method: {
                    type: "NEQUI",
                    phone_number: nequiPhoneNumber
                },
                public_key: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
                reference: reference,
                signature: signature,
                redirect_url: `https://${request.headers.get('host')}/order/success?store=${storeName}`,
                session_id: sessionId,
            }),
        });
        
        const wompiTransactionData = await wompiResponse.json();

        if (!wompiResponse.ok) {
            console.error("Wompi Error:", wompiTransactionData.error);
            return NextResponse.json({ error: wompiTransactionData.error?.messages || "Failed to create Wompi transaction" }, { status: 500 });
        }
        
        // For Nequi, we don't need to return a transactionId for redirect
        return NextResponse.json({ success: true, message: "Payment initiated" });

    } catch (error) {
        console.error("[CHECKOUT_POST]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}