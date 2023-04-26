/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  // distDir: 'dist', // 静态化
  output: 'standalone',
  trailingSlash: true,
  transpilePackages: ['antd'],
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || ''}/api/:path*`, // Proxy to Backend
        },
      ],
    }
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: /url/ }, // exclude if *.svg?url
      use: ['@svgr/webpack'],
    }) // 针对 SVG 的处理规则
    return config
  },
}

module.exports = nextConfig
