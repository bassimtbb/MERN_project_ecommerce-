'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { itemCount } = useCart();
    const { user, loginAs, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-xl font-bold text-primary-600 tracking-tight">
                    🛒 MERN Shop
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link href="/products" className="hover:text-primary-600 transition-colors hidden md:block">
                        Products
                    </Link>
                    <Link href="/orders" className="hover:text-primary-600 transition-colors hidden md:block">
                        Orders
                    </Link>
                    {user?.role === 'Admin' && (
                        <Link href="/admin" className="px-3 py-1.5 rounded-xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">
                            Admin Panel
                        </Link>
                    )}
                    <Link href="/cart" className="relative hover:text-primary-600 transition-colors">
                        Cart
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-primary-600 text-[10px] font-bold text-white flex items-center justify-center">
                                {itemCount > 99 ? '99+' : itemCount}
                            </span>
                        )}
                    </Link>

                    <div className="h-6 w-px bg-gray-200 hidden md:block" />

                    {!user ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => loginAs('client')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Login as Client
                            </button>
                            <button
                                onClick={() => loginAs('Admin')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all active:scale-95"
                            >
                                Login as Admin
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Logged as</p>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{user.prenom}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}