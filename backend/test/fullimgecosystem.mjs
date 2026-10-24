//AI FILE
import fs from 'node:fs';
import { extname, basename, join, dirname } from 'node:path';
import { convert_image } from '../src/bridge/orchestrator.mjs';

const [, , input, target, quality = '80'] = process.argv;
const output = `backend/test/output/a`;

if (!input || !target) {
    console.log('usage: node backend/test/convert.mjs <input file> <target format> [quality]');
    console.log('example: node backend/test/convert.mjs backend/test/samples/test.png jpg 85');
    process.exit(1);
}

try {
    const bytes = new Uint8Array(fs.readFileSync(input));
    const out = await convert_image(target, bytes, Number(quality));

    const outPath = join(dirname(output), `${basename(input, extname(input))}_out.${target}`);
    fs.writeFileSync(outPath, Buffer.from(out));
    console.log(`wrote ${outPath} (${out.length} bytes)`);
} catch (err) {
    console.error(`${err.code ?? 'error'}: ${err.message}`);
    if (process.env.DEBUG) console.error(err);
}
