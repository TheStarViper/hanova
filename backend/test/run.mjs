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

    const view = Module.convert_to_jpeg(inputBytes, 90); // quality 90
    if (view === null) {
        throw new Error('Conversion failed');
    }
    const jpegBytes = new Uint8Array(view); 
    
    console.log(`Output JPEG: ${jpegBytes.length} bytes`);

    writeFileSync('./test_output.jpg', jpegBytes);
    console.log(' success conversion to jpg');

    const pngView = Module.convert_to_png(inputBytes);
    const pngBytes = new Uint8Array(pngView);
    writeFileSync('./test_output_roundtrip.png', pngBytes);
    console.log(` png conversion: (${pngBytes.length} bytes)`);
}


main().catch((err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
