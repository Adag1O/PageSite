import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = path.resolve('/Users/chuy/Desktop/PageSite/', 'public/Cartas');
const outputDir = path.resolve('/Users/chuy/Desktop/PageSite/', 'public/loteria');

if (!fs.existsSync(inputDir)) {
  console.error('Input directory does not exist:', inputDir);
  process.exit(1);
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace(/\.[^.]+$/, '.avif'));
  // Only process image files
  if (fs.statSync(inputPath).isFile() && /\.(jpg|jpeg|png|webp|)$/i.test(file)) {
    sharp(inputPath)
      .toFormat('avif')
      .toFile(outputPath)
      .then(info => console.log('Converted:', outputPath))
      .catch(err => console.error('Error:', file, err));
  }
});