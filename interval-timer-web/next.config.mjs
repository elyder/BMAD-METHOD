/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Disable image optimization if you don't have a custom loader
  images: {
    unoptimized: true,
  },
};

export default nextConfig;