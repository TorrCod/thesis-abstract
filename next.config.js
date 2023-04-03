/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === "development"
})

const nextConfig = withPWA(
  {
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
)

module.exports = nextConfig
