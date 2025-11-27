#!/usr/bin/env node

/**
 * Compile Biennial SCSS into a single public/biennial.css
 */

const fs = require("fs");
const path = require("path");
const sass = require("sass");

const ENTRY_SCSS = path.join(
  __dirname,
  "../pages/biennial/biennial-2026/assets/css/biennial.scss"
);
const OUTPUT_CSS_FILE = path.join(__dirname, "../public/biennial.css");

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_CSS_FILE), { recursive: true });

try {
  // Compile SCSS to CSS
  const result = sass.compile(ENTRY_SCSS, { style: "expanded" });

  // Write to public/biennial.css
  fs.writeFileSync(OUTPUT_CSS_FILE, result.css);

  console.log(`[biennial-css] Successfully compiled ${ENTRY_SCSS} to ${OUTPUT_CSS_FILE}`);
} catch (err) {
  console.error("[biennial-css] Failed to compile SCSS:", err);
  process.exit(1);
}
