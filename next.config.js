/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Silence Turbopack warning và tránh worker error
};

module.exports = nextConfig;