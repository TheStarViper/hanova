import { readFileSync } from 'fs';

const INPUT_PATH = './testsmall.png';

async function main() {
  const createModule = (await import('./magick_module.js')).default;
  const Module = await createModule();

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
