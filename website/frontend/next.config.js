/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    // This will allow Next.js to attempt to resolve
    // modules in the 'lib' directory
    outputFileTracingRoot: __dirname,
  },
};

module.exports = nextConfig;
