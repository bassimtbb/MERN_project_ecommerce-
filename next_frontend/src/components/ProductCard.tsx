'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

/** Helper to resolve various ID formats to a string */
function resolveId(item: any): string {
    if (item.$oid) return item.$oid;
    if (item._id) return resolveId(item._id);
    if (item.id) return item.id;
    return String(item);
}

/** Format a number as currency (e.g. 29.99 → "$29.99") */
function formatPrice(price: number): string {
    return price.toFixed(2);
}

/** Map a category string to a Tailwind badge colour */
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

export default function ProductCard({ product }: ProductCardProps) {
    const { addItemToCart } = useCart();
    const [adding, setAdding] = useState(false);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        const targetId = product._id || product.id;

        if (!targetId || product.stock === 0) return;

        try {
            setAdding(true);
            await addItemToCart(targetId, 1);
            setTimeout(() => setAdding(false), 1500);
        } catch (err) {
            setAdding(false);
        }
    };

    const isOutOfStock = product.stock === 0;

    return (
        <article className={`group flex flex-col rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${isOutOfStock ? 'grayscale opacity-80' : ''}`}>

            {/* ── Image Wrapper ── */}
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                <svg
                    className={`w-24 h-24 transition-transform duration-700 ${isOutOfStock ? 'text-gray-300' : 'text-primary-100 group-hover:scale-110'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none ${categoryColor(product.category)} shadow-sm`}>
                        {product.category}
                    </span>
                    {isOutOfStock && (
                        <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none bg-gray-900 text-white shadow-lg">
                            Sold Out
                        </span>
                    )}
                </div>

                {/* Limited Stock Overlay */}
                {!isOutOfStock && product.stock! <= 5 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-orange-600/90 text-white py-2 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">
                            ⚠️ Limited Stock: {product.stock} Left
                        </p>
                    </div>
                )}
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col flex-1 p-5 gap-4">
                <div className="min-h-[44px]">
                    <h2 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h2>
                </div>

                <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-gray-900 tracking-tight">
                        ${formatPrice(product.price)}
                    </p>
                </div>

                {/* ── Actions ── */}
                <div className="flex gap-2">
                    <Link
                        href={`/products/${product._id || product.id}`}
                        className="flex-1 text-center text-xs font-black uppercase tracking-widest py-3 rounded-2xl border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Info
                    </Link>
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={adding || isOutOfStock}
                        className={`flex-[2] text-xs font-black uppercase tracking-widest py-3 rounded-2xl transition-all active:scale-95 shadow-lg
                        ${isOutOfStock ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed border-2 border-transparent' :
                                adding ? 'bg-green-500 text-white shadow-green-100' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100 hover:-translate-y-0.5'}`}
                    >
                        {adding ? '✓ Added' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    );
}
