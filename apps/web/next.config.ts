import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "**.supabase.co" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  turbopack: {
    root: path.join(process.cwd(), "../../"),
  },
  output: "standalone",
  serverExternalPackages: ["resend"],
};

export default nextConfig;
