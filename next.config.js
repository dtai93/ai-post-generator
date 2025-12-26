/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Giữ lại dòng này nếu bạn đang dùng Turbopack để tránh warning

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.redd.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'preview.redd.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v.redd.it',
        port: '',
        pathname: '/**',
      },
      // Nếu tool của bạn dùng thêm domain khác (ví dụ external-preview.redd.it hoặc imgur, unsplash,...), thêm tương tự
    ],
  },
};

module.exports = nextConfig;