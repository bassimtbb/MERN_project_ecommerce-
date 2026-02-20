'use client';

import React, { useState, useEffect } from 'react';
import { getAllOrders } from '@/services/orderService';
import type { Order, User } from '@/types';

function statusColor(status: string): string {
    const map: Record<string, string> = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Completed: 'bg-green-100 text-green-700',
        Cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (err) {
                console.error('Failed to load orders', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
                <p className="text-gray-500 mt-2">Monitor all transactions and order statuses globally.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Order ID</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Date</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Amount</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">Loading global orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">No orders found on the system.</td>
                                </tr>
                            ) : orders.map((order) => {
                                const user = order.user as User;
                                return (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">
                                            #{order._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{user?.prenom} {user?.nom}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1.5 rounded-xl font-bold ${statusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
