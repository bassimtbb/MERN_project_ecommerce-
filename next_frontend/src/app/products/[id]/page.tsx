'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/services/productService';
import type { Product } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
    return price.toFixed(2);
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(iso));
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

/**
 * Normalise MongoDB _id / Mongoose virtual id into a single string.
 * Handles: { _id: "abc" }, { id: "abc" }, or { _id: { $oid: "abc" } }
 */
function resolveId(product: Product): string {
    return product.id ?? product._id ?? '';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            {/* Image skeleton */}
            <div className="rounded-2xl bg-gray-200 aspect-square w-full" />

            {/* Text skeleton */}
            <div className="flex flex-col gap-5 py-4">
                <div className="h-5 w-24 bg-gray-200 rounded-full" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded w-1/3 mt-2" />
                <div className="h-4 bg-gray-200 rounded w-2/5 mt-4" />
                <div className="h-px bg-gray-200 mt-2" />
                <div className="flex gap-3 mt-4">
                    <div className="h-12 bg-gray-200 rounded-xl w-36" />
                </div>
                <div className="h-14 bg-gray-200 rounded-xl mt-2" />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { addItemToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);
                const data = await getProductById(id);
                setProduct(data);
            } catch {
                setError('Product not found or the server is unavailable.');
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        const targetId = product._id || product.id;

        if (!targetId) {
            console.error('ProductDetailPage: Missing product ID', product);
            return;
        }

        try {
            setAdded(true);
            await addItemToCart(targetId, quantity);
            setTimeout(() => setAdded(false), 2000);
        } catch (err) {
            setAdded(false);
        }
    };

    return (
        <div className="space-y-8">

            {/* ── Back link ── */}
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
            </Link>

            {/* ── Loading skeleton ── */}
            {loading && <DetailSkeleton />}

            {/* ── Error state ── */}
            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-32 text-center gap-5">
                    <div className="text-6xl">⚠️</div>
                    <p className="text-gray-600 max-w-sm text-base">{error}</p>
                    <Link href="/products" className="btn-primary">
                        ← Back to Products
                    </Link>
                </div>
            )}

            {/* ── Product detail ── */}
            {!loading && product && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* ─ Left column: Image ─ */}
                    <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 aspect-square flex items-center justify-center overflow-hidden shadow-inner">
                        <svg
                            className="w-40 h-40 text-primary-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={0.8}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                            />
                        </svg>
                    </div>

                    {/* ─ Right column: Details ─ */}
                    <div className="flex flex-col gap-5">

                        {/* Category badge */}
                        <span
                            className={`self-start px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${categoryColor(product.category)}`}
                        >
                            {product.category}
                        </span>

                        {/* Product name */}
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Price */}
                        <p className="text-4xl font-extrabold text-primary-600">
                            {formatPrice(product.price)}
                        </p>

                        {/* Stock Alert */}
                        <div className="mt-1">
                            {product.stock === 0 ? (
                                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm font-black text-red-600 uppercase tracking-widest leading-none">Sold Out</p>
                                        <p className="text-xs text-red-400 font-medium">This item is currently unavailable.</p>
                                    </div>
                                </div>
                            ) : product.stock! <= 5 ? (
                                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-3 animate-pulse">
                                    <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm font-black text-orange-600 uppercase tracking-widest leading-none">Hurry!</p>
                                        <p className="text-xs text-orange-500 font-bold">Only {product.stock} left in stock</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-green-600 font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    In Stock ({product.stock} units)
                                </p>
                            )}
                        </div>

                        {/* Listed date — only rendered if present (Mongoose timestamps may be absent) */}
                        {product.createdAt && (
                            <p className="text-sm text-gray-400">
                                Listed on{' '}
                                <span className="text-gray-600 font-medium">
                                    {formatDate(product.createdAt)}
                                </span>
                            </p>
                        )}

                        {/* Product ID (useful for debugging) */}
                        <p className="text-xs text-gray-300 font-mono">
                            ID: {resolveId(product)}
                        </p>

                        <hr className="border-gray-100" />

                        {/* Quantity counter */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Quantity</label>
                            <div className="inline-flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center
                             text-gray-700 hover:bg-gray-50 active:scale-95 transition-all
                             disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Decrease quantity"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                    </svg>
                                </button>

                                <span
                                    className="w-10 text-center text-lg font-semibold text-gray-900"
                                    aria-live="polite"
                                    aria-label={`Quantity: ${quantity}`}
                                >
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    disabled={product.stock !== undefined && quantity >= product.stock}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center
                             text-gray-700 hover:bg-gray-50 active:scale-95 transition-all
                             disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Increase quantity"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart button */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`mt-2 w-full py-4 rounded-2xl text-base font-black uppercase tracking-widest
                         transition-all duration-200 active:scale-[0.98] shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         ${product.stock === 0 ? 'bg-gray-100 text-gray-400 shadow-none border border-gray-200' :
                                    added ? 'bg-green-500 text-white shadow-green-100' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
                                }`}
                        >
                            {added
                                ? '✓ Added'
                                : product.stock === 0
                                    ? 'Sold Out'
                                    : `Add ${quantity} to Cart`
                            }
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
