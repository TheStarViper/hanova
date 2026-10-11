import { init_imagemagick, process_image, ImageMagick, MagickFormat, MagickGeometry } from '../src/bridge/imagemagick-bridge.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const MODULE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../frontend/src/lib/cpp');

async function test(){
  await init_imagemagick();
  console.log(`ImageMagick Ver: ${ImageMagick.ver}`);

  await process_image('./backend/test/samples/test.png','output.',(image,lib)=>{
    const geometry = new lib.MagickGeometry(800,600);
    geometry.greater = true;

    image.resize(geometry);
    image.quality = 90;
  });
  console.log('Image successfully processed and saved as output');
}

test().catch((error)=>{
  console.error("error",error);
});