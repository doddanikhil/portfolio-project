const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // REMOVE the rewrites section completely - it's pointing to localhost!
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://127.0.0.1:8000/api/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;