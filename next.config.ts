import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      // Reddit domains (giữ nguyên của bạn)
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
      // Thêm các domain phổ biến mà meme-api hay dùng
      {
        protocol: "https",
        hostname: "i.imgflip.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgflip.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
        port: "",
        pathname: "/**",
      },
      // Fix triệt để: cho phép tất cả domain HTTPS (an toàn cho mini app này vì chỉ dùng Image component)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Silence Turbopack warning nếu có
  turbopack: {},
};

export default nextConfig;