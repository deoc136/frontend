/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['eatsopinionfiles.s3.amazonaws.com','appdccimages.s3.amazonaws.com' ],
    },
  };
  
  export default nextConfig;