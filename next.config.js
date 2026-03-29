/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // 基础别名设置
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // 客户端专用配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // 完全在服务器端排除这个包
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@imgly/background-removal');
    }

    return config;
  },
};

module.exports = nextConfig;
