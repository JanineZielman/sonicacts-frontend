#!/usr/bin/env node

/**
 * Generate sitemap for the Biennial 2026 website.
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");

// CHANGE THIS TO YOUR PRODUCTION DOMAIN
const BASE_URL = "https://sonicacts.com";

// CHANGE THIS IF NEEDED (your Strapi backend URL)
const STRAPI_URL = process.env.STRAPI_URL || "https://cms.sonicacts.com/api";

async function fetchStrapi(path) {
  try {
    const res = await axios.get(`${STRAPI_URL}${path}`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Failed fetching:", path, err.message);
    return [];
  }
}

async function generate() {
  console.log("Generating Biennial sitemap...");

  // -----------------------------
  // 1. STATIC BIENNIAL PAGES
  // -----------------------------
  const staticPages = [
    "/biennial/biennial-2026",
    "/biennial/biennial-2026/news",
    "/biennial/biennial-2026/artists",
    "/biennial/biennial-2026/programme",
    "/biennial/biennial-2026/about",
    "/biennial/biennial-2026/tickets",
    "/biennial/biennial-2026/visit",
  ];

  // -----------------------------
  // 2. FETCH DYNAMIC CONTENT FROM STRAPI
  // -----------------------------
  const news = await fetchStrapi("/news-items?filters[biennials][slug][$eq]=biennial-2026&populate=*");
  const artists = await fetchStrapi("/community-items?filters[biennials][slug][$eq]=biennial-2026&populate=*");
  const events = await fetchStrapi("/programme-items?filters[biennial][slug][$eq]=biennial-2026&populate=*");

  const newsUrls = news.map((item) => `/biennial/biennial-2026/news/${item.attributes.slug}`);
  const artistUrls = artists.map((item) => `/biennial/biennial-2026/artists/${item.attributes.slug}`);
  const eventUrls = events.map((item) => `/biennial/biennial-2026/programme/${item.attributes.slug}`);

  const urls = [...staticPages, ...newsUrls, ...artistUrls, ...eventUrls];

  // -----------------------------
  // 3. BUILD XML
  // -----------------------------
  const urlset = urls
    .map((url) => {
      return `
    <url>
      <loc>${BASE_URL}${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urlset}
</urlset>`;

  // -----------------------------
  // 4. WRITE FILE
  // -----------------------------
  const targetFile = path.join(process.cwd(), "public", "sitemap-biennial.xml");
  fs.writeFileSync(targetFile, xml);

  console.log("✓ Biennial sitemap generated:", targetFile);
}

generate();
