import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join} from 'path';

const MODULE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../frontend/src/lib/cpp');

const INPUT_PATH = './backend/test/samples/test.bmp';

async function main() {
  const modulePath = pathToFileURL(join(MODULE_DIR, 'magick_module.js')).href;
  const createModule = (await import(modulePath)).default;

  const Module = await createModule({
    locateFile: (path) => join(MODULE_DIR, path),
  });

  const inputBytes = new Uint8Array(readFileSync(INPUT_PATH));
  console.log(`Input: ${INPUT_PATH} (${inputBytes.length} bytes)\n`);

  const result = Module.magick_identify(inputBytes);

  if (!result.ok) {
    console.log(`FAIL  ${result.error}`);
    return;
  }

  console.log(`OK    format=${result.format}  ${result.width}x${result.height}`);
}

main().catch((err) => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});