import { init } from "../src/bridge/nodeMagick.mjs";
import { converterFactory, FORMATS } from "../src/bridge/orchestrator.mjs";

const INPUT_IMAGES = {
  /**
   * JPEG, 20.4 MB
   * (the Wikimedia Commons' picture of the day as I'm writing this code)
   */
  "ocelot.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/9/91/016_Ocelot_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",

  /**
   * PNG, 187 MB
   */
  "mandelbrot.png":
    "https://upload.wikimedia.org/wikipedia/commons/4/4d/Mandelbox_14072019.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
};

const QUALITY = 90;

class Result {
  constructor(format, inputName, inputSize, startTime, endTime) {
    this.format = format;
    this.inputName = inputName;
    this.inputSize = inputSize;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  get millisecondsPerByte() {
    const delta = this.endTime - this.startTime;
    return delta / this.inputSize;
  }
}

const CLEAR_LINE_ANSI = "\x1b[K";

async function run() {
  await init();
  const converter = await converterFactory();

  /** @type {Record<(typeof FORMATS)[number], Result[]>} */
  const resultMap = {};

  for (const name in INPUT_IMAGES) {
    console.log(`Processing ${name}:`);

    const url = INPUT_IMAGES[name];

    const response = await fetch(url);
    const inputBuffer = Buffer.from(await response.arrayBuffer());
    const inputSize = inputBuffer.byteLength;

    for (const format of FORMATS) {
      process.stdout.write(
        `\rPROCESSING - ${name} -> ${format} ${CLEAR_LINE_ANSI}`,
      );

      const start = Date.now();
      try {
        const outBytes = await converter(format, inputBuffer, QUALITY);

        const end = Date.now();

        process.stdout.write(
          `\rDONE in ${
            (end - start) / 1000
          }s - ${name} -> ${format} ${CLEAR_LINE_ANSI}\n`,
        );

        const result = new Result(format, name, inputSize, start, end);

        if (resultMap[format] === undefined) {
          resultMap[format] = [result];
        } else {
          resultMap[format].push(result);
        }
      } catch (err) {
        process.stdout.write(
          `\rFAILED - ${name} -> ${format} ${CLEAR_LINE_ANSI}\n`,
        );
        continue;
      }
    }
  }

  console.log(resultMap);

  /** @type {Record<(typeof FORMATS)[number], number>} */
  const encodingSpeedMap = {};

  for (const format in resultMap) {
    /** @type {Result[]}  */
    const results = resultMap[format];
    const sum = results.reduce((acc, res) => acc + res.millisecondsPerByte, 0);
    const avg = sum / results.length;
    encodingSpeedMap[format] = avg;
  }

  console.log(encodingSpeedMap);
}

await run();
