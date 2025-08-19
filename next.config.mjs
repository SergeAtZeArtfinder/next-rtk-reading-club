/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  // You can add more Next.js config options here
}

nextConfig
