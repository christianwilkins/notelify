/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BMC_ID: process.env.BMC_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
