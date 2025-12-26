import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.redd.it",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "preview.redd.it",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "external-preview.redd.it",
        port: "",
        pathname: "/**",
      },
      // Thêm để fix ảnh meme từ meme-api.com (thực tế ảnh từ reddit)
      {
        protocol: "https",
        hostname: "**",  // Cho phép tất cả domain remote (an toàn vì meme từ reddit, và project mini app)
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Silence Turbopack warning nếu Vercel còn kêu
  turbopack: {},
};

export default nextConfig;