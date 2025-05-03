import withPWA from 'next-pwa';

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
};

const nextConfig = {
  // Other Next.js configurations
};

export default withPWA({
  ...nextConfig,
  ...pwaConfig,
});
