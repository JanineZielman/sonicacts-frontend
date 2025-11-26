#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
let sharp;

try {
  // Prefer local installation; fall back gracefully if unavailable
  // eslint-disable-next-line global-require
  sharp = require('sharp');
} catch (error) {
  console.warn('[webp] sharp module not found. Skipping WebP generation.');
  console.warn('[webp] Install sharp or disable the prebuild script if WebP output is required.');
  process.exit(0);
}

const fsPromises = fs.promises;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

let convertedCount = 0;
let skippedCount = 0;
let failedCount = 0;

async function ensureDirectoryExists(directory) {
  try {
    await fsPromises.access(directory);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function convertPngToWebp(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');

  try {
    const [pngStat, webpStat] = await Promise.all([
      fsPromises.stat(pngPath),
      fsPromises.stat(webpPath).catch(() => null),
    ]);

    if (webpStat && webpStat.mtimeMs >= pngStat.mtimeMs) {
      skippedCount += 1;
      return;
    }

    await sharp(pngPath)
      .webp({ quality: 90 })
      .toFile(webpPath);

    convertedCount += 1;
  } catch (error) {
    failedCount += 1;
    console.error(`[webp] Failed to convert ${pngPath}:`, error.message);
  }
}

async function walkDirectory(directory) {
  const entries = await fsPromises.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walkDirectory(entryPath);
      continue;
    }

    if (/\.png$/i.test(entry.name)) {
      await convertPngToWebp(entryPath);
    }
  }
}

async function run() {
  const exists = await ensureDirectoryExists(PUBLIC_DIR);

  if (!exists) {
    console.warn('[webp] public directory not found; skipping WebP generation');
    return;
  }

  await walkDirectory(PUBLIC_DIR);

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('[webp] Unexpected error:', error);
  process.exit(1);
});
