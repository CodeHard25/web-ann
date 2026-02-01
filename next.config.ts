import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH ? `/${process.env.BASE_PATH}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
