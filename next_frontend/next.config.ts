import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Allow images to be served from the backend server
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
