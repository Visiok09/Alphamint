const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    domains: ['nft-market-online.infura-ipfs.io'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
