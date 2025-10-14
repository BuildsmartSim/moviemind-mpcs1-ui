import { readdir } from 'node:fs/promises';
import path from 'node:path';

const forbiddenExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.psd',
  '.tif',
  '.tiff'
]);

const allowList = new Set(['node_modules', '.git']);

/**
 * Recursively walk a directory and collect forbidden files.
 * @param {string} dir
 * @param {string[]} results
 */
async function walk(dir, results) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (allowList.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(absolutePath, results);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (forbiddenExtensions.has(ext) && entry.name !== '.gitkeep') {
      results.push(path.relative(process.cwd(), absolutePath));
    }
  }
}

async function main() {
  const root = process.cwd();
  const offenders = [];
  await walk(root, offenders);

  if (offenders.length > 0) {
    console.error('Found forbidden binary assets in the repository:');
    for (const file of offenders) {
      console.error(` - ${file}`);
    }
    console.error('\nRemove the files above or replace them with data-URL or SVG placeholders.');
    process.exit(1);
  }

  console.log('✅ No forbidden binary assets detected.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
