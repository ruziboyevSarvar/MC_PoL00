import type { NextConfig } from "next";

function remoteImageHost(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value.replace(/\/api\/?$/, ""));
    return { protocol: url.protocol.replace(":", "") as "http" | "https", hostname: url.hostname };
  } catch {
    return null;
  }
}

const remotePatterns = [
  { protocol: "https" as const, hostname: "images.unsplash.com" },
  { protocol: "https" as const, hostname: "uzbpower.vvv.uz" },
  { protocol: "https" as const, hostname: "mcpoloo-backend-38zy.onrender.com" },
  { protocol: "http" as const, hostname: "localhost" },
  { protocol: "http" as const, hostname: "127.0.0.1" },
  remoteImageHost(process.env.NEXT_PUBLIC_API_URL),
  remoteImageHost(process.env.NEXT_PUBLIC_ASSET_URL)
].filter((pattern): pattern is { protocol: "http" | "https"; hostname: string } => Boolean(pattern));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/catalog",
        permanent: false
      }
    ];
  },
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
