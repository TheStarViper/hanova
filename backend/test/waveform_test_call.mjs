import fs from 'node:fs/promises';
import { universalFactory } from './orchestrator.mjs';

async function runTest() {
  try {
    console.log('1. Initializing converter factory...');
    const { convert } = await universalFactory();

    console.log('2. Reading input audio file (input.mp3)...');
    const audioBuffer = await fs.readFile('./input.mp3');

    console.log('3. Converting audio to video with a waveform visualizer...');
    const videoBuffer = await convert('mp4', audioBuffer, {
      backgroundColor: 'black',
      waveColor: '#00ffcc',
      mode: 'line',
      video: {
        width: 1280,
        height: 720,
        bitrate: 2e6,
      },
      onProgress: (p) => {
        process.stdout.write(`\rProgress: ${(p * 100).toFixed(1)}%`);
      },
    });

    console.log('\n4. Writing output video to disk (output-waveform.mp4)...');
    await fs.writeFile('./output-waveform.mp4', videoBuffer);

    console.log('✨ Success! Waveform video generated successfully.');
  } catch (error) {
    console.error('\n Conversion failed:', error);
  }
}

runTest();