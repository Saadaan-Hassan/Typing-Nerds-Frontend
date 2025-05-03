declare module 'next-pwa' {
  import { NextConfig } from 'next';
  const withPWA: (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
