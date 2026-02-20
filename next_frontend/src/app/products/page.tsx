'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/services/productService';
import type { Product } from '@/types';

// ─── Skeleton loader for a single card ────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-52 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
                <div className="flex gap-2 mt-1">
                    <div className="h-9 bg-gray-200 rounded-lg flex-1" />
                    <div className="h-9 bg-gray-200 rounded-lg flex-1" />
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter States
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [showOutOfStock, setShowOutOfStock] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllProducts();
                const items = Array.isArray(response)
                    ? response
                    : (response as { data: Product[] }).data ?? [];
                setProducts(items);

                // Set initial max price based on data
                if (items.length > 0) {
                    const highest = Math.ceil(Math.max(...items.map(p => p.price || 0)));
                    setMaxPrice(highest);
                }
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Could not load products. Make sure your backend is running on port 5000.');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    // Derived Categories
    const categories = useMemo(() => {
        const set = new Set(products.map(p => p.category));
        return Array.from(set).sort();
    }, [products]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === '' || p.category === category;
            const matchesPrice = p.price <= maxPrice;
            const matchesStock = showOutOfStock || (p.stock || 0) > 0;

            return matchesSearch && matchesCategory && matchesPrice && matchesStock;
        });
    }, [products, search, category, maxPrice, showOutOfStock]);

    return (
        <div className="space-y-10 pb-20">
            {/* ── Page Header ── */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gallery</h1>
                <p className="text-gray-500 mt-2 font-medium">Explore our curated collection of premium goods.</p>
            </div>

            {/* ── Resource Bar ── */}
            <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Search Products</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Looking for something?"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-medium text-sm text-gray-900"
                            />
                            <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary-500 focus:ring-0 transition-all font-bold text-sm text-gray-900 appearance-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Max Price</label>
                            <span className="text-xs font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg">${maxPrice}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>

                    {/* Stock Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group" onClick={() => setShowOutOfStock(!showOutOfStock)}>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 leading-none">Out of Stock</span>
                            <span className="text-[10px] text-gray-400 font-medium">Show unavailable items</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${showOutOfStock ? 'bg-primary-600' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${showOutOfStock ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Results Count ── */}
            <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-100" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Showing {filteredProducts.length} Results
                </p>
                <span className="h-px flex-1 bg-gray-100" />
            </div>

            {/* ── Grid/States ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-3xl">⚠️</div>
                    <p className="text-gray-500 font-medium max-w-sm">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">Retry</button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">No products match your filters</h3>
                        <p className="text-gray-500 mt-1 font-medium italic">Try adjusting your search or clearing filters.</p>
                    </div>
                    <button onClick={() => { setSearch(''); setCategory(''); setMaxPrice(1000); setShowOutOfStock(false); }} className="text-primary-600 font-black uppercase text-xs tracking-widest hover:underline decoration-2 underline-offset-4">Reset All Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
