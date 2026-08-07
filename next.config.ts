import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "**.supabase.co" },
      { hostname: "res.cloudinary.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
