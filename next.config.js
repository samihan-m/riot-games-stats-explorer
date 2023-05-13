/** @type {import('next').NextConfig} */
const isProd = (process.env.NODE_ENV === "production")

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // https://stackoverflow.com/a/75208523
    // look at https://github.com/node-fetch/node-fetch/issues/1624#issuecomment-1407717012 if it still doesn't work
    apiUrl: "https://riot-stats-api.herokuapp.com", //"https://rudra-riot-stats-api.loophole.site", //"https://rudra-riot-stats.serveo.net", // "http://api.samihansclub.com",
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
