import test from 'node:test';
import { strict as assert } from 'node:assert';
import fs from 'node:fs/promises';
import { universalFactory, createconverter } from '../src/bridge/orchestrator.mjs';
import { PRESETS } from "../src/bridge/mediabunny-bridge.mjs";
import { MEDIA_PRESETS } from "../src/bridge/formats.mjs";

test("the preset lists match", () => {
  assert.deepEqual(Object.keys(PRESETS), MEDIA_PRESETS);
});

test("audio -> video draws a waveform when the engine exists", async () => {
  const media = {
    convert_audio_to_video: async (b, to) => new Uint8Array([...b, ...Buffer.from(`waveform:${to}`)])
  };
  const converter = createconverter({ media });
  const input = new Uint8Array([1]);
  const result = await converter.convert_video("mp4", input, { from: "mp3" });
  assert.deepEqual(result, new Uint8Array([1, ...Buffer.from("waveform:mp4")]));
});

async function runTest() {
  try {
    console.log('1. Initializing universal converter...');
    const { convert } = await universalFactory();

    console.log('2. Reading input audio file...');
    const fileBuffer = await fs.readFile('backend/test/samples/test.mp3');
    const uint8Data = Uint8Array.from(fileBuffer);

    console.log('3. Converting audio to video with waveform...');
    const videoBuffer = await convert(uint8Data, 'mp4', {
      backgroundColor: '#000000',
      waveColor: '#00ffcc',
      video: {
        width: 1280,
        height: 720,
      },
      onProgress: (p) => {
        process.stdout.write(`\rProgress: ${(p * 100).toFixed(1)}%`);
      },
    });

    console.log('\n4. Writing output video to disk...');
    await fs.writeFile('backend/test/samples/output/output.mp4', videoBuffer);

    console.log('Success! Waveform video generated at backend/test/samples/output/output.mp4');
  } catch (error) {
    console.error('\nConversion failed:', error);
  }
}

// Uncomment if you want to run the manual integration script directly:
runTest();