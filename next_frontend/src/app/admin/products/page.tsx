'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/services/productService';
import type { Product } from '@/types';

export default function ManageProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        category: 'electronics',
        stock: 0,
        description: ''
    });

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts(1, 100); // Fetch a large batch for management
            setProducts(data.data);
        } catch (err) {
            console.error('Failed to load products', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await addProduct(newProduct);
            setShowAddModal(false);
            setNewProduct({ name: '', price: 0, category: 'electronics', stock: 0, description: '' });
            await loadProducts();
        } catch (err) {
            alert('Failed to add product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStockUpdate = async (id: string, currentStock: number) => {
        const newStock = prompt('Enter new stock quantity:', String(currentStock));
        if (newStock === null) return;

        try {
            await updateProduct(id, { stock: parseInt(newStock) });
            await loadProducts();
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                    <p className="text-gray-500 mt-2">Add, update, or remove items from your store.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Product</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Category</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Price</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Stock</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading products...</td>
                                </tr>
                            ) : products.map((product) => {
                                const id = product._id || product.id;
                                return (
                                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-400 font-mono">ID: {id.slice(-8)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${product.stock && product.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                                                {product.stock ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleStockUpdate(id, product.stock ?? 0)}
                                                    className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all"
                                                    title="Edit Stock"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                                                    title="Delete Product"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Price</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Internal Stock</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Category</label>
                                <select
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="books">Books</option>
                                    <option value="food">Food</option>
                                    <option value="sport">Sport</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
