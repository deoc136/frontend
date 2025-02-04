/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['eatsopinionfiles.s3.amazonaws.com','appdccimages.s3.amazonaws.com'],
    },
    transpilePackages: ['@aws-amplify/auth'],
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        './runtimeConfig': './runtimeConfig.browser',
      };
      return config;
    },
  };
  
  export default nextConfig;