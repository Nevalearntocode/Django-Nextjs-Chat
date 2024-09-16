/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        hostname: "pub-cc3bcbea941249db9806f1d9ad518908.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
