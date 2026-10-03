import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const INPUT_PATH = './backend/test/test.png';
// const INPUT_PATH = './backend/test/smalltest.png';
// const INPUT_PATH = './backend/test/testwebp.webp';
const OUTPUT_DIR = './backend/test/output';

mkdirSync(OUTPUT_DIR, { recursive: true });


const moduleLoaders = {
  core: () => import('../../frontend/src/lib/cpp/image_core_module.js'),
  webp: () => import('../../frontend/src/lib/cpp/webp_module.js'),
};

const loadedModules = {};

async function getModule(name) {
  if (!loadedModules[name]) {
    const createModule = (await moduleLoaders[name]()).default;
    loadedModules[name] = await createModule();
  }
  return loadedModules[name];
}


const conversions = [
  {module: 'core', fn: 'convert_to_png',  args: [],      ext: 'png',  label: 'PNG (roundtrip)' },
  {module: 'core', fn: 'convert_to_jpeg', args: [90],    ext: 'jpg',  label: 'JPEG' },
  {module: 'core', fn: 'convert_to_bmp',  args: [],      ext: 'bmp',  label: 'BMP' },
  {module: 'core', fn: 'convert_to_tga',  args: [],      ext: 'tga',  label: 'TGA' },
  {module: 'core', fn: 'convert_to_hdr',  args: [],      ext: 'hdr',  label: 'HDR' },
  {module: 'core', fn: 'convert_to_ico',  args: [],      ext: 'ico',  label: 'ICO' },
  {module: 'webp', fn: 'convert_to_webp', args: [0],   ext: 'webp', label: 'WebP' },
]; //soyjack pointing* look at this aura


async function runConversion(inputBytes, { module, fn, args, ext, label }) {
  const Module = await getModule(module);

  if (typeof Module[fn] !== 'function') {
    console.log(`SKIP  ${label.padEnd(20)}  ${fn} not found on ${module} module`);
    return;
  }
  
  const result = Module[fn](inputBytes, ...args);

  if (!result.ok) {
    console.log(`FAIL  ${label.padEnd(20)}  ${result.error}`);
    return;
  }

  const bytes = new Uint8Array(result.data);
  const outPath = `${OUTPUT_DIR}/test_output.${ext}`;
  writeFileSync(outPath, bytes);
  console.log(`OK    ${label.padEnd(20)}  ${bytes.length} bytes -> ${outPath}`);
}

async function main() {
  const inputBytes = new Uint8Array(readFileSync(INPUT_PATH));
  console.log(`Input: ${INPUT_PATH} (${inputBytes.length} bytes)\n`);

  const core = await getModule('core');
  const width = core.get_image_width(inputBytes);
  const height = core.get_image_height(inputBytes);
  console.log(`Detected dimensions: ${width}x${height}\n`);
  if (width === -1 || height === -1) {
    throw new Error('Failed to read image, corrupt file or unsupported format');
  }

  for (const conversion of conversions) {
    await runConversion(inputBytes, conversion);
  }
}


main().catch((err) => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});