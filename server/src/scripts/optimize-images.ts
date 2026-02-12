import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'path';

const IMAGE_SOURCE_PATH = 'app/src/assets/images';
const IMAGE_OUTPUT_PATH =
    process.env.NODE_ENV === 'production'
        ? 'app/build/assets/images'
        : 'app/public/assets/images';

const optimizeImages = async () => {
    console.log('--- Optimizing images ---');

    try {
        await fs.ensureDir(IMAGE_OUTPUT_PATH);

        const imageFiles = await glob(`${IMAGE_SOURCE_PATH}/**/*.{jpg,jpeg,png,gif,ico}`);

        for (const imagePath of imageFiles) {
            const relativePath = path.relative(IMAGE_SOURCE_PATH, imagePath);
            const destPath = path.join(IMAGE_OUTPUT_PATH, relativePath);
            const destDir = path.dirname(destPath);
            const ext = path.extname(imagePath).toLowerCase();

            await fs.ensureDir(destDir);

            // Copy original image
            await fs.copy(imagePath, destPath);
            console.log(`Copied: ${relativePath}`);

            // Only convert to WebP if it's not an ICO file
            if (ext !== '.ico') {
                const webpPath = destPath.replace(/\.[^/.]+$/, "") + ".webp";
                await sharp(imagePath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                console.log(`Converted to WebP: ${path.relative(IMAGE_OUTPUT_PATH, webpPath)}`);
            } else {
                console.log(`Skipped WebP conversion for ICO file: ${relativePath}`);
            }
        }

        console.log('--- Image optimization complete ---');
    } catch (error) {
        console.error('Error during image optimization:', error);
        process.exit(1);
    }
};

optimizeImages();
