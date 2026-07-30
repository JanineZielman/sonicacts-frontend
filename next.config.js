/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    loader: "default",
    domains: ["localhost", "cms.sonicacts.com"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: "/portal", destination: "https://sonicacts.com/", permanent: true },
      { source: "/portal/:path*", destination: "https://sonicacts.com/", permanent: true },
      { source: "/sashop", destination: "https://shop.sonicacts.com/", permanent: true },
      { source: "/sashop/:path*", destination: "https://shop.sonicacts.com/:path*", permanent: true },
      { source: "/darkecology", destination: "https://darkecology.net", permanent: true },
      { source: "/darkecology/:path*", destination: "https://darkecology.net/:path*", permanent: true },
      { source: "/2016", destination: "https://old.sonicacts.com/2016", permanent: true },
      { source: "/2016/:path*", destination: "https://old.sonicacts.com/2016/:path*", permanent: true },
      { source: "/2017", destination: "https://old.sonicacts.com/2017", permanent: true },
      { source: "/2017/:path*", destination: "https://old.sonicacts.com/2017/:path*", permanent: true },
      { source: "/2018", destination: "https://old.sonicacts.com/2018", permanent: true },
      { source: "/2018/:path*", destination: "https://old.sonicacts.com/2018/:path*", permanent: true },

      { source: "https://portal.sonicacts.com", destination: "https://old.sonicacts.com", permanent: true },
      { source: "https://portal.sonicacts.com/:path*", destination: "https://old.sonicacts.com/:path*", permanent: true },

      { source: "/biennial-2022", destination: "https://2022.sonicacts.com", permanent: true },
      { source: "/biennial2022", destination: "https://2022.sonicacts.com", permanent: true },

      // Move Biennial 2026 to dedicated subdomain
      { source: "/biennial/biennial-2026", destination: "https://2026.sonicacts.com/biennial/biennial-2026", permanent: true },
      { source: "/biennial/biennial-2026/:path*", destination: "https://2026.sonicacts.com/biennial/biennial-2026/:path*", permanent: true },

      { source: "/undefined", destination: "/404", permanent: true },
      { source: "/undefined/:path*", destination: "/404", permanent: true },

      { source: "/discover/:path*", destination: "/archive/:path*", permanent: true },

      { source: "/cadaverexquisito", destination: "https://on.soundcloud.com/PRNZx", permanent: true }

    ]
  },
}

module.exports = nextConfig
