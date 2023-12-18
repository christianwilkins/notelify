/** @type {import('next').NextConfig} */
const nextConfig = {
        env: {
          BMC_ID: process.env.BMC_ID,
        },
      };

module.exports = nextConfig
