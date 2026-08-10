import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "**.supabase.co" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },


  output: "standalone",
};

export default nextConfig;
