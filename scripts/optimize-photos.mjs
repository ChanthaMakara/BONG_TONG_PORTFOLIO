import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'src/assets/photos';

for (const folder of fs.readdirSync(ROOT)) {
  const dir = path.join(ROOT, folder);
  if (!fs.statSync(dir).isDirectory()) continue;

  for (const file of fs.readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(/\.[^.]+$/, '.webp'));

    await sharp(input)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output);

    fs.unlinkSync(input);
    console.log('✓', output);
  }
}
