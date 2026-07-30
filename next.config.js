/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Limit build workers to prevent EAGAIN errors on the server
  experimental: {
    cpus: 1,
  },

  images: {
    loader: "default",
    domains: ["localhost", "cms.sonicacts.com"],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      // Redirect portal.sonicacts.com to old.sonicacts.com
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "portal.sonicacts.com",
          },
        ],
        destination: "https://old.sonicacts.com/:path*",
        permanent: true,
      },

      // Legacy portal paths
      {
        source: "/portal",
        destination: "https://sonicacts.com/",
        permanent: true,
      },
      {
        source: "/portal/:path*",
        destination: "https://sonicacts.com/",
        permanent: true,
      },

      // Shop
      {
        source: "/sashop",
        destination: "https://shop.sonicacts.com/",
        permanent: true,
      },
      {
        source: "/sashop/:path*",
        destination: "https://shop.sonicacts.com/:path*",
        permanent: true,
      },

      // Dark Ecology
      {
        source: "/darkecology",
        destination: "https://darkecology.net",
        permanent: true,
      },
      {
        source: "/darkecology/:path*",
        destination: "https://darkecology.net/:path*",
        permanent: true,
      },

      // Festival archives
      {
        source: "/2016",
        destination: "https://old.sonicacts.com/2016",
        permanent: true,
      },
      {
        source: "/2016/:path*",
        destination: "https://old.sonicacts.com/2016/:path*",
        permanent: true,
      },
      {
        source: "/2017",
        destination: "https://old.sonicacts.com/2017",
        permanent: true,
      },
      {
        source: "/2017/:path*",
        destination: "https://old.sonicacts.com/2017/:path*",
        permanent: true,
      },
      {
        source: "/2018",
        destination: "https://old.sonicacts.com/2018",
        permanent: true,
      },
      {
        source: "/2018/:path*",
        destination: "https://old.sonicacts.com/2018/:path*",
        permanent: true,
      },

      // Biennial 2022
      {
        source: "/biennial-2022",
        destination: "https://2022.sonicacts.com",
        permanent: true,
      },
      {
        source: "/biennial2022",
        destination: "https://2022.sonicacts.com",
        permanent: true,
      },

      // Biennial 2026
      {
        source: "/biennial/biennial-2026",
        destination:
          "https://2026.sonicacts.com/biennial/biennial-2026",
        permanent: true,
      },
      {
        source: "/biennial/biennial-2026/:path*",
        destination:
          "https://2026.sonicacts.com/biennial/biennial-2026/:path*",
        permanent: true,
      },

      // Invalid URLs
      {
        source: "/undefined",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/undefined/:path*",
        destination: "/404",
        permanent: true,
      },

      // Renamed section
      {
        source: "/discover/:path*",
        destination: "/archive/:path*",
        permanent: true,
      },

      // External project
      {
        source: "/cadaverexquisito",
        destination: "https://on.soundcloud.com/PRNZx",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;