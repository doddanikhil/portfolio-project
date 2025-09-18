/** @type {import('next').NextConfig} */
const nextConfig = {
    // Output configuration
    output: 'standalone',
    
    // Image optimization
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
      ],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // TypeScript configuration
    typescript: {
      ignoreBuildErrors: false,
    },
    
    // ESLint configuration
    eslint: {
      ignoreDuringBuilds: false,
    },
    
    // Experimental features
    experimental: {
      optimizePackageImports: ['lucide-react'],
    },
    
    // Environment variables
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    
    // Headers for security
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    },
    
    // Redirects (if needed)
    async redirects() {
      return [
        // Add any redirects here
      ];
    },
    
    // Webpack configuration
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;