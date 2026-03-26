import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = './public/assets';

async function optimizeImages() {
  console.log('Optimizing images... This might take a few seconds.');
  const files = await fs.readdir(dir);
  const webpFiles = files.filter(f => f.endsWith('.webp') && f.match(/^\d{2}_/));

  for (const file of webpFiles) {
    const filePath = path.join(dir, file);
    try {
      const data = await fs.readFile(filePath);
      // Resize to 800px width (which is plenty for the project-item size)
      const optimized = await sharp(data)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
        
      await fs.writeFile(filePath, optimized);
      const originalKB = (data.length / 1024).toFixed(1);
      const newKB = (optimized.length / 1024).toFixed(1);
      const percent = Math.round((1 - (optimized.length / data.length)) * 100);
      console.log(`[Success] ${file}: ${originalKB}KB -> ${newKB}KB (Reduced by ${percent}%)`);
    } catch (err) {
      console.error(`[Error] Failed to optimize ${file}:`, err.message);
    }
  }
}

optimizeImages();
