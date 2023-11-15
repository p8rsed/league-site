/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ddragon.leagueoflegends.com",
      },
    ],
  },
};

module.exports = nextConfig;
