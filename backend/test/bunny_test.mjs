import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath, fileURLToPathBuffer } from 'node:url';
import { dirname, join } from 'node:path';
import { convert_media, MEDIA_FORMATS } from '../src/bridge/mediabunny-bridge.mjs';

const sample = join(dirname(fileURLToPath(import.meta.url)),'samples','test.mp4');
const hassample = fs.existsSync(sample);

test(`mkv`,()=>{
    assert.ok(MEDIA_FORMATS.includes('mkv'));
});

test(`unsupported test`,async ()=>{
    await assert.rejects(convert_media(new Uint8Array(0),'xyz'),/unsupported media/i); //wtf does this do bro
});

test(`mp4 to mkv`,{skip: !hassample && `put a test.mp4 in backend/test/samples`}, async ()=>{
    const input = new Uint8Array(fs.readFileSync(sample));
    const out = await convert_media(input,'mkv');

    assert.ok(out instanceof Uint8Array);
    assert.ok(out.length > 0,'output is empty');

    //magick numahhs
    assert.deepEqual([...out.subarray(0,4)],[0x1a,0x45,0xdf,0xa3]);
})