import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle GLTF and GLB files
    config.module.rules.push({
      test: /\.(gltf|glb)$/,
      type: 'asset/resource',
    });

    // Handle other 3D model related files
    config.module.rules.push({
      test: /\.(bin)$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Enable static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
