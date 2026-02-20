import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
    title: {
        default: 'My E-Commerce Store',
        template: '%s | My E-Commerce Store',
    },
    description: 'A modern MERN stack e-commerce application.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                        {/* ── Main Content ── */}
                        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                            {children}
                        </main>

                        {/* ── Footer ── */}
                        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} MERN Shop. All rights reserved.
                        </footer>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
