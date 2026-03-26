import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = './public/assets';

async function optimizeImages() {
  console.log('Optimizing project gallery images... This might take 10-20 seconds.');
  const files = await fs.readdir(dir);
  
  // Filter for large images based on extension (we already optimized the 01_USAID ones)
  const imageFiles = files.filter(f => 
    (f.endsWith('.webp') || f.endsWith('.jpeg') || f.endsWith('.jpg')) && !f.match(/^\d{2}_/)
  );

  for (const file of imageFiles) {
    const filePath = path.join(dir, file);
    try {
      const data = await fs.readFile(filePath);
      // Skip small files (under 300KB) to avoid reprocessing or harming quality of small assets
      if (data.length < 300 * 1024) continue;

      // Project gallery images might be displayed full screen, so 1920px max width is perfect
      let pipeline = sharp(data).resize({ width: 1920, withoutEnlargement: true });
      
      // Keep output format the same as input
      if (file.endsWith('.webp')) {
        pipeline = pipeline.webp({ quality: 80, effort: 4 });
      } else if (file.match(/\.jpe?g$/i)) {
        pipeline = pipeline.jpeg({ quality: 80, progressive: true });
      }

      const optimized = await pipeline.toBuffer();
        
      await fs.writeFile(filePath, optimized);
      const originalMB = (data.length / (1024 * 1024)).toFixed(1);
      const newKB = (optimized.length / 1024).toFixed(1);
      const percent = Math.round((1 - (optimized.length / data.length)) * 100);
      console.log(`[Success] ${file}: ${originalMB}MB -> ${newKB}KB (Reduced by ${percent}%)`);
    } catch (err) {
      console.error(`[Error] Failed to optimize ${file}:`, err.message);
    }
  }
  console.log('Done!');
}

optimizeImages();
