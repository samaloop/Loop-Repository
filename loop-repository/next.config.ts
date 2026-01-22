/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Sesuaikan dengan ukuran file PDF Anda
    },
  },
};

export default nextConfig;