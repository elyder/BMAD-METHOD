/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/timer', // Add this line for subdirectory deployment
  // Optional: Disable image optimization if you don't have a custom loader
  images: {
    unoptimized: true,
  },
};

export default nextConfig;