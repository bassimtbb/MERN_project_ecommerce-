'use client';

import React, { useEffect, useState } from 'react';
import { getMyOrders } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Completed: 'bg-green-100 text-green-700',
        Cancelled: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}

export default function OrderHistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const userId = user._id || user.id;
                const data = await getMyOrders(userId);
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (authLoading || (user && loading)) {
        return (
            <div className="max-w-4xl mx-auto py-10 space-y-6">
                <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 w-full bg-gray-100 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order History Locked</h1>
                <p className="text-gray-500">Please login as a Client or Admin to view your past purchases.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">You have no previous orders.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Order ID: {order._id.substring(order._id.length - 8)}
                                </span>
                                <span className="text-gray-900 font-bold text-lg">
                                    {order.totalAmount.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Placed on {formatDate(order.createdAt)}
                                </span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-2">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="w-10 h-10 rounded-full bg-primary-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary-600 shadow-sm"
                                            title={item.productName}
                                        >
                                            {item.quantity}x
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
