import { readFileSync, writeFileSync } from 'fs';
import createModule from '../../frontend/src/lib/cpp/cpp_module.js'

async function main(){
    const Module = await createModule();

    const inputBytes = new Uint8Array(readFileSync('./backend/test/test.png'));
    console.log(`Input PNG: ${inputBytes.length} bytes`);

    const width = Module.get_image_width(inputBytes);
    const height = Module.get_image_height(inputBytes);
    console.log(`Detected dimensions: ${width}x${height}`);
    
    if (width === -1 || height === -1) {
        throw new Error('Failed to read image — corrupt file or unsupported format');
    }

    const jpegResult = Module.convert_to_jpeg(inputBytes, 10);
    if (!jpegResult.ok) {
        throw new Error(`JPEG conversion failed: ${jpegResult.error}`);
    }
    const jpegBytes = new Uint8Array(jpegResult.data);
    console.log(`Output JPEG: ${jpegBytes.length} bytes`);
    writeFileSync('./test_output.jpg', jpegBytes);
    console.log('success conversion to jpg');

    const bmpResult = Module.convert_to_bmp(inputBytes);
    if (!bmpResult.ok) {
        throw new Error(`BMP conversion failed: ${bmpResult.error}`);
    }
    const bmpBytes = new Uint8Array(bmpResult.data);
    console.log(`Output JPEG: ${bmpBytes.length} bytes`);
    writeFileSync('./test_output.bmp', bmpBytes);
    console.log('success conversion to bmp');

    const pngResult = Module.convert_to_png(inputBytes);
    if (!pngResult.ok) {
        throw new Error(`PNG conversion failed: ${pngResult.error}`);
    }
    const pngBytes = new Uint8Array(pngResult.data);
    writeFileSync('./test_output_roundtrip.png', pngBytes);
    console.log(`png conversion: (${pngBytes.length} bytes)`);
}

main().catch((err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});