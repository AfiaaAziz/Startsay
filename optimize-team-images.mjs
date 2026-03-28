import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = './public/assets/team';

async function optimizeTeamImages() {
  console.log('Optimizing team member images...');
  const files = await fs.readdir(dir);

  const imageFiles = files.filter(f =>
    f.endsWith('.webp') || f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png')
  );

  for (const file of imageFiles) {
    const filePath = path.join(dir, file);
    try {
      const data = await fs.readFile(filePath);
      const originalKB = (data.length / 1024).toFixed(1);

      // Team photos are displayed as small portrait cards — 800px is plenty
      let pipeline = sharp(data).resize({ width: 800, withoutEnlargement: true });

      // Always output as webp for best compression
      pipeline = pipeline.webp({ quality: 80, effort: 4 });

      // Keep the same filename but ensure .webp extension
      const outName = file.replace(/\.(jpeg|jpg|png)$/i, '.webp');
      const outPath = path.join(dir, outName);

      const optimized = await pipeline.toBuffer();
      await fs.writeFile(outPath, optimized);

      // If original was not webp, delete the old file
      if (outName !== file) {
        await fs.unlink(filePath);
        console.log(`[Converted] ${file} -> ${outName}`);
      }

      const newKB = (optimized.length / 1024).toFixed(1);
      const percent = Math.round((1 - (optimized.length / data.length)) * 100);
      console.log(`[✓] ${outName}: ${originalKB}KB -> ${newKB}KB (saved ${percent}%)`);
    } catch (err) {
      console.error(`[Error] ${file}:`, err.message);
    }
  }
  console.log('Done!');
}

optimizeTeamImages();
