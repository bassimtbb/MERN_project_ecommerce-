'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/services/productService';
import { getAllOrders } from '@/services/orderService';
import { getUsers } from '@/services/userService';
import type { Product, Order, User } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [users, productsData, orders] = await Promise.all([
                    getUsers(),
                    getProducts(1, 1000), // Get all products for counting and alerts
                    getAllOrders()
                ]);

                const products = productsData.data;

                // Calculate Stats
                const completedOrders = orders.filter(o => o.status === 'Completed');
                const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

                setStats({
                    totalUsers: users.length,
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue
                });

                // Inventory Alerts (stock < 5)
                const alerts = products.filter(p => (p.stock ?? 0) < 5);
                setLowStockProducts(alerts);

                // Recent 5 Orders
                const sortedOrders = [...orders].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 5);
                setRecentOrders(sortedOrders);

            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Overview</h1>
                <p className="text-gray-500 mt-2 font-medium">Real-time performance metrics and system health.</p>
            </div>

            {/* Summary Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Users', value: stats.totalUsers, color: 'blue', icon: (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )
                    },
                    {
                        label: 'Products', value: stats.totalProducts, color: 'indigo', icon: (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        )
                    },
                    {
                        label: 'Total Orders', value: stats.totalOrders, color: 'emerald', icon: (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        )
                    },
                    {
                        label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'primary', icon: (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )
                    }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inventory Alerts */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        ⚠️ Low Stock Alerts
                    </h2>
                    <div className="space-y-3">
                        {lowStockProducts.length === 0 ? (
                            <div className="p-6 rounded-3xl bg-green-50 border border-green-100 text-green-700 font-bold text-center">
                                All stock levels healthy ✅
                            </div>
                        ) : lowStockProducts.map(p => (
                            <div key={p._id || p.id} className="p-4 rounded-2xl bg-white border-2 border-red-50 hover:border-red-100 transition-colors flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{p.name}</p>
                                    <p className="text-xs text-red-500 font-black uppercase tracking-tight">Only {p.stock} left</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {lowStockProducts.length > 0 && (
                        <Link href="/admin/products" className="block w-full py-4 text-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-primary-300 hover:text-primary-600 transition-all">
                            Manage Inventory
                        </Link>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Orders</h2>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Customer</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Date</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Amount</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium italic">No recent orders.</td>
                                        </tr>
                                    ) : recentOrders.map(order => {
                                        const customer = order.user as User;
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">{customer?.prenom} {customer?.nom}</p>
                                                    <p className="text-xs text-gray-500">{customer?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 font-black text-gray-900">
                                                    ${order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {recentOrders.length > 0 && (
                            <Link href="/admin/orders" className="block w-full py-4 text-center bg-gray-50 text-gray-500 font-bold border-t border-gray-100 hover:bg-gray-100 transition-colors">
                                View All Orders
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
