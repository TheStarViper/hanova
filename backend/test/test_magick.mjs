import { process_image } from "../src/bridge/nodeMagickHarness.mjs";

const INPUT_PATH = './backend/test/samples';
const OUTPUT_PATH = './backend/test/output';

async function test() {
  await process_image(`${INPUT_PATH}/test.png`,`${OUTPUT_PATH}/imagemagick_test.avif`,(image,geo)=>{
    const geometry = new geo(800,600);
    geometry.greater = true;

    image.resize(geometry);
    image.quality = 90;
  });
  console.log('Image successfully processed and saved as output');
}

test();
