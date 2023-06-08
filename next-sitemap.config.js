const siteUrl = 'https://sonicacts.com/';
module.exports = {
  siteUrl,
  exclude: ["/404", "/biennial/hero", "/biennial/poster", "/biennial/type", "/biennial/type0", "/biennial/type1", "/biennial/type2", "/logo"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/404"],
      },
      { userAgent: "*", allow: "/" },
    ],
  },
};