/** @type {import('next').NextConfig} */
const isProd = (process.env.NODE_ENV === "production")

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // https://stackoverflow.com/a/75208523
    // look at https://github.com/node-fetch/node-fetch/issues/1624#issuecomment-1407717012 if it still doesn't work
    apiUrl: "http://api.samihansclub.com",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        port: "",
        pathname: "/latest/game/assets/**"
      },
    ]
  }
}

module.exports = nextConfig
