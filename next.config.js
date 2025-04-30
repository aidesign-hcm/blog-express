/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "blog.aithietke.com",
      },
      {
        protocol: "https",
        hostname: "cdn1.aithietke.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXT_PUBLIC_SITE_NAME: "VN EXPRESS!",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
