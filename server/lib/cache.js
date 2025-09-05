import fs from 'fs';
import path from 'path';

const cacheDir = path.join(process.cwd(), 'server', 'cache');
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

export function get(key) {
  const file = path.join(cacheDir, `${encodeURIComponent(key)}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return null;
}

export function set(key, data) {
  const file = path.join(cacheDir, `${encodeURIComponent(key)}.json`);
  fs.writeFileSync(file, JSON.stringify(data));
}
