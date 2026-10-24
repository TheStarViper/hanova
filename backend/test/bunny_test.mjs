import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import '../src/bridge/node-setup.mjs';
import { convert_media, MEDIA_FORMATS } from '../src/bridge/mediabunny-bridge.mjs';

const directory = join(dirname(fileURLToPath(import.meta.url)),'samples');
const sample = join(directory,'test.mp4');
const skip = fs.existsSync(sample) ? false : 'no file';

const load = () => new Uint8Array(fs.readFileSync(sample));
const keep = (name,bytes)=>{
    if (process.env.KEEP){fs.writeFileSync(join(directory,name),bytes);}
};

test(`mkv`,()=>{
    assert.ok(MEDIA_FORMATS.includes('mkv'));
});

test(`unsupported test`,async ()=>{
    await assert.rejects(convert_media(new Uint8Array(0),'xyz'),/unsupported media/i); //wtf does this do bro
});

test(`mp4 to mkv`,{ skip }, async ()=>{
    const input = load();
    const out = await convert_media(input,'mkv',{
        video: {height: 720, bitrate: 1_500_000},
        audio: {bitrate: 96_000},
    });

    fs.writeFileSync('backend/test/output/test_out.mkv', out);

    assert.ok(out instanceof Uint8Array);
    assert.ok(out.length > 0,'output is empty');

    //magic numahhs
    assert.deepEqual([...out.subarray(0,4)],[0x1a,0x45,0xdf,0xa3]);

    const ratio = out.length / input.length;
    assert.ok(ratio > 0.8 && ratio < 1.2, `size changed too much (${ratio.toFixed(2)}x)`);
});