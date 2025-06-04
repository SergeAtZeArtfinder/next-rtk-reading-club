import withMDX from "@next/mdx"
import rehypePrism from "rehype-prism-plus"

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
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // You can add more Next.js config options here
}

export default withMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypePrism],
  },
})(nextConfig)
