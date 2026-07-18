/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         { hostname: 'tzemer.co.il' },
      ],
   },
   experimental: {
      serverComponentsExternalPackages: ['mongoose', 'jsonwebtoken'],
   },
};

export default nextConfig;