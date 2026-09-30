import type { NextConfig } from "next";

// Every route prerenders as static (○); a normal build lets Vercel serve the OG image
// with the right content type and optimise images.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
