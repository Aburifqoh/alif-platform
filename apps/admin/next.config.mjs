import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
