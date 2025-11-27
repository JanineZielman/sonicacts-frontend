#!/usr/bin/env node

/**

* Compile all Portal SCSS into a single public/portal.css
* and remove @font-face declarations.
* Files are compiled in a specific explicit order.
  */

const fs = require("fs");
const path = require("path");
const sass = require("sass");

const PORTAL_SCSS_DIR = path.join(__dirname, "../assets/css");
const OUTPUT_CSS_FILE = path.join(__dirname, "../public/portal.css");

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_CSS_FILE), { recursive: true });

// Explicit SCSS compilation order
const scssOrder = [
  "style.scss",
  "article.scss",
  "filter.scss",
  "agenda.scss",
  "search.scss",
  "slider.scss",
  "festival.scss",
  "animation.scss",
  "timetable.scss",
  "error.scss",
  "breakpoints.scss",
  "festival-breakpoints.scss"
];

const scssFiles = scssOrder.map(f => path.join(PORTAL_SCSS_DIR, f));

// Concatenate all SCSS into one string
const concatenatedScss = scssFiles
  .map(file => fs.readFileSync(file, "utf8"))
  .join("\n");

try {
  // Compile to CSS
  const result = sass.compileString(concatenatedScss, { style: "expanded" });

  let css = result.css;

  // Remove @font-face {...} blocks
  css = css.replace(/@font-face\s*{[^}]*}/g, "");

  // Write cleaned CSS
  fs.writeFileSync(OUTPUT_CSS_FILE, css);

  console.log(`[portal-css] Successfully compiled ${scssFiles.length} SCSS files → ${OUTPUT_CSS_FILE}`);
  console.log(`[portal-css] Removed @font-face declarations`);
} catch (err) {
  console.error("[portal-css] Failed to compile SCSS:", err);
  process.exit(1);
}
