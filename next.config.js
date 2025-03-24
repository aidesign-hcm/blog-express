/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aithietke.com",
      },
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
    ],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    WORDPRESS_API_URL: "blog.aithietke.com",
    ANGOLIA_SERET: "e1cb7d00ae64a9733c861bade89fbe8e",
    MAIN_URL: "https://blog.aithietke.com",
    GOOGLE_CLIENT_ID:
      "735703049093-l25psgvmupto9fkt88mo889p7nunp2tf.apps.googleusercontent.com",
    NEXT_PUBLIC_SITE_NAME: "VN EXPRESS!",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
