/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['react-pdf$'] = 'react-pdf/dist/esm/entry.webpack';
    }
    return config;
  },
  compiler:{
    removeConsole:process.env.NODE_ENV === "production"
  }
}

module.exports = nextConfig
