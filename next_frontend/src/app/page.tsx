export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to MERN Shop
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-md">
                Your modern e-commerce platform. Browse products, manage your cart, and more.
            </p>
            <a href="/products" className="btn-primary text-base px-6 py-3">
                Shop Now →
            </a>
        </div>
    );
}
