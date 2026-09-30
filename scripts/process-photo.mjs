// Crops the CV photo to a 4:5 portrait and emits colour + grayscale WebP for the About section.
import sharp from "sharp";

const src = "assets/source/photo-from-cv.png";
const crop = { left: 96, top: 0, width: 500, height: 625 };

await sharp(src).extract(crop).webp({ quality: 82 }).toFile("public/images/david.webp");
await sharp(src)
  .extract(crop)
  .grayscale()
  .linear(1.15, -12)
  .webp({ quality: 82 })
  .toFile("public/images/david-mono.webp");
console.log("photo done");
