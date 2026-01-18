/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: Disable image optimization if you don't have a custom loader
  images: {
    unoptimized: true,
  },
  // Explicitly tell Next.js/Turbopack the project root to avoid monorepo path confusion.
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;