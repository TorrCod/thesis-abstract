/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const ContentSecurityPolicy = `
  default-src 'self' http://localhost:3000;
  script-src 'self';
  child-src;
  style-src self;
  font-src 'self';
  report-uri /api/csp-reports/csp
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];

const nextConfig = withPWA({
  reactStrictMode: true,
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["react-pdf$"] = "react-pdf/dist/esm/entry.webpack";
    }
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  headers: async () => [
    {
      // Apply these headers to all routes in your application.
      source: "/:path*",
      headers: securityHeaders,
    },
  ],
});

module.exports = nextConfig;

// {
//   key: "Content-Security-Policy-Report-Only",
//   value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
// },
// {
//   key: "Content-Security-Policy-Report-Only",
//   value: "policy",
// },
