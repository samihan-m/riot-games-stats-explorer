/** @type {import('next').NextConfig} */
const isProd = (process.env.NODE_ENV === "production")

const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    // https://stackoverflow.com/a/75208523
    // look at https://github.com/node-fetch/node-fetch/issues/1624#issuecomment-1407717012 if it still doesn't work
    apiUrl: (isProd ? "https://riot-stats-api.herokuapp.com" : "http://127.0.0.1:8000"),
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
