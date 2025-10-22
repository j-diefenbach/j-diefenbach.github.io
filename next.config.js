const isProd = process.env.NODE_ENV === "production";
 
const nextConfig = {
  // basePath: "/out",
  // assetPrefix: "/out",
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  eslint: {
      ignoreDuringBuilds: true,
  },

};
 
module.exports = nextConfig;