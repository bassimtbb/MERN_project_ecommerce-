'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { checkout } from '@/services/orderService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
    return price.toFixed(2);
}

function categoryColor(category: string): string {
    const map: Record<string, string> = {
        electronics: 'bg-blue-100 text-blue-700',
        clothing: 'bg-purple-100 text-purple-700',
        books: 'bg-yellow-100 text-yellow-700',
        food: 'bg-green-100 text-green-700',
        sport: 'bg-orange-100 text-orange-700',
        accessories: 'bg-pink-100 text-pink-700',
    };
    return map[category.toLowerCase()] ?? 'bg-gray-100 text-gray-700';
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CartPage() {
    const { cart, loading: cartLoading, refreshCart, removeItemFromCart, updateItemQuantity } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto-clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const loading = cartLoading || authLoading;

    // Calculate Subtotal (Price * Quantity)
    const total = cart.reduce((acc, item) => {
        const price = item.product.price || 0;
        return acc + price * item.quantity;
    }, 0);

    const handleCheckout = async () => {
        if (!user) return;

        try {
            setIsCheckingOut(true);
            setError(null); // Clear previous errors

            const userId = user._id || user.id;

            // Map cart to the format expected by the backend (including legacy fields for safety)
            const mappedItems = cart.map(item => ({
                productId: (item.product as any)._id || (item.product as any).id || String(item.product),
                _id: (item.product as any)._id || (item.product as any).id || String(item.product), // Legacy support
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            }));

            console.log('Checkout Payload:', { userId, items: mappedItems });

            await checkout(userId, mappedItems as any);

            // On success: refresh cart (it should be empty now) and redirect
            await refreshCart();
            router.push('/orders');
        } catch (err: any) {
            console.error('Checkout failed:', err);
            setError(err.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Loading your shopping cart...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Login Required</h1>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        Please use the buttons in the Navbar to login as a Client or Admin to view your cart.
                    </p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                </div>
                <Link href="/products" className="btn-primary px-8 py-3">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* ── Cart Items List (8 Columns) ── */}
                <div className="lg:col-span-8 space-y-4">
                    {cart.map((item) => {
                        const product = item.product;
                        const productId = (product as any)._id || (product as any).id;

                        return (
                            <div
                                key={productId}
                                className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Product Image Placeholder */}
                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-10 h-10 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="font-semibold text-gray-900 line-clamp-1 truncate">
                                            {product.name}
                                        </h2>
                                        <span className="text-sm font-bold text-gray-900">
                                            {formatPrice(product.price * item.quantity)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${categoryColor(product.category)}`}>
                                            {product.category}
                                        </span>
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                            <button
                                                onClick={() => updateItemQuantity(productId, -1)}
                                                disabled={item.quantity <= 1}
                                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                                            </button>
                                            <span className="text-xs font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => {
                                                    if (item.quantity >= (product.stock || 0)) {
                                                        setError(`Cannot add more: only ${product.stock} available`);
                                                        return;
                                                    }
                                                    updateItemQuantity(productId, 1);
                                                }}
                                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeItemFromCart(productId)}
                                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
                                    aria-label={`Remove ${product.name} from cart`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* ── Order Summary (4 Columns) ── */}
                <div className="lg:col-span-4 sticky top-24">
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-black text-primary-600 tracking-tight">
                                {formatPrice(total)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={isCheckingOut || cart.length === 0}
                            className={`w-full py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 active:scale-[0.98] transition-all shadow-md shadow-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center gap-2 ${isCheckingOut || cart.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isCheckingOut ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Proceed to Checkout'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
