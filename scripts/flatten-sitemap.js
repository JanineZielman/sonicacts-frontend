const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
const fragmentFiles = fs
  .readdirSync(publicDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /^sitemap-\d+\.xml$/.test(entry.name));

if (!fragmentFiles.length) {
  process.exit(0);
}

let header = null;
const urlBlocks = [];

for (const entry of fragmentFiles) {
  const filePath = path.join(publicDir, entry.name);
  const contents = fs.readFileSync(filePath, "utf8");
  const urlSetMatch = contents.match(/<urlset[^>]*>([\s\S]*?)<\/urlset>/);
  if (!urlSetMatch) {
    continue;
  }

  if (!header) {
    const headerMatch = contents.match(/<urlset[^>]*>/);
    header = headerMatch
      ? headerMatch[0]
      : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  }

  urlBlocks.push(urlSetMatch[1].trim());
  fs.unlinkSync(filePath);
}

if (!header || !urlBlocks.length) {
  process.exit(0);
}

const merged = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  header,
  urlBlocks.join("\n"),
  "</urlset>",
].join("\n");

const targetPath = path.join(publicDir, "sitemap.xml");
fs.writeFileSync(targetPath, merged);
