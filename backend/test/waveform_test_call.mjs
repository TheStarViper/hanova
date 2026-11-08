import fs from 'node:fs/promises';
import { universalFactory } from '../src/bridge/orchestrator.mjs';

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
    console.error('\n Conversion failed:', error);
  }
}

runTest();