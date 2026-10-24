import fs from "node:fs";
import { extname } from "node:path";
import {
  FORMATS,
  ImageMagick,
  MagickGeometry,
  summarize_errors,
} from "../src/bridge/imagemagick-bridge.mjs";
import { init } from "../src/bridge/nodeMagick.mjs";

const INPUT_PATH = "./backend/test/samples";
const OUTPUT_PATH = "./backend/test/output";

async function process_image(inputpath, outputpath) {
  await init();

  const inputbytes = fs.readFileSync(inputpath);
  const format = FORMATS[extname(outputpath).toLowerCase()];
  if (!format) throw new Error(`Unsupported output extension: ${outputpath}`);

  let output;
  try {
    await ImageMagick.read(
      new Uint8Array(inputbytes),
      async (image) => {
        const geometry = new MagickGeometry(800, 600);
        geometry.greater = true;

        image.resize(geometry);
        image.quality = 90;

        image.write(format, (data) => {
          output = Buffer.from(data);
        });
      },
    );
  } catch (error) {
    throw summarize_errors(error);
  }
  fs.writeFileSync(outputpath, output);
}

async function test() {
  await process_image(
    `${INPUT_PATH}/test.png`,
    `${OUTPUT_PATH}/imagemagick_test.avif`,
  );
  console.log("Image successfully processed and saved as output");
}

test();
