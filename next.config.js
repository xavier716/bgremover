/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // 客户端配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // 确保 WebAssembly 文件正确处理
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // 排除服务器端打包客户端专用包
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@imgly/background-removal');
    }

    return config;
  },

  // 启用 WebAssembly 支持
  experiments: {
    asyncWebAssembly: true,
  },
};

module.exports = nextConfig;
