import fs from "node:fs";
import { ImageMagick } from "../src/bridge/imagemagick-bridge.mjs";
import { init } from "../src/bridge/nodeMagick.mjs";
import { converterFactory, FORMATS } from "../src/bridge/orchestrator.mjs";

/**
 * @typedef {(typeof FORMATS)[number]} Format
 */

const QUALITY = 90;

class Result {
  constructor(
    inputFormat,
    outputFormat,
    inputSize,
    outputSize,
    startTime,
    endTime,
  ) {
    this.inputFormat = inputFormat;
    this.outputFormat = outputFormat;
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

/**
 * @param {Format} inputFormat
 * @param {Buffer<ArrayBuffer>} inputBuffer
 * @returns {Promise<Result[]>}
 */
async function testAllFormats(inputFormat, inputBuffer) {
  console.log(`\n${inputFormat} input:`);

  const resultsForThisInput = [];

  for (const outputFormat of FORMATS) {
    if (inputFormat === outputFormat) continue;

    try {
      const start = Date.now();

      const outBuffer = await converter(outputFormat, inputBuffer, QUALITY);
      if (outputFormat === "png") pngBuffer = outBuffer;

      const end = Date.now();

      console.log(
        `DONE in ${(end - start) / 1000}s - ${inputFormat} -> ${outputFormat}`,
      );

      const result = new Result(
        inputFormat,
        outputFormat,
        inputBuffer.byteLength,
        outBuffer.byteLength,
        start,
        end,
      );

      resultsForThisInput.push(result);
    } catch (err) {
      console.log(`SKIPPING - ${inputFormat} -> ${outputFormat}`);
      console.log(err);
      continue;
    }
  }

  return resultsForThisInput;
}

await init();
const converter = await converterFactory();

/**
 * JPEG, 20.4 MB
 * (the Wikimedia Commons' picture of the day as I'm writing this code)
 * {@link https://upload.wikimedia.org/wikipedia/commons/9/91/016_Ocelot_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original}
 */
const path = "backend/test/samples/ocelot.jpg";
const jpegBuffer = fs.readFileSync(path);

let pngBuffer;

let imagePixels;
ImageMagick.read(new Uint8Array(jpegBuffer), (image) => {
  imagePixels = image.width * image.height;
});

const jpegResults = await testAllFormats("jpg", jpegBuffer);
const pngResults = await testAllFormats("png", pngBuffer);

const allResults = [jpegResults, pngResults].flat();

/** @type {Record<Format, number>} */
let pixelsPerByte = {};
/** @type {Record<Format, number>} */
let millisecondsPerPixel = {};

FORMATS.forEach((format) => {
  const results = allResults.filter((res) => res.outputFormat === format);

  const avgWeight = results.reduce((acc, res) => acc + res.outputSize, 0)
    / results.length;
  const avgTime = results.reduce((acc, res) =>
    acc + res.endTime - res.startTime, 0) / results.length;

  pixelsPerByte[format] = imagePixels / avgWeight;
  millisecondsPerPixel[format] = avgTime / imagePixels;
});

const data = {
  pixelsPerByte,
  millisecondsPerPixel,
};
fs.writeFileSync(
  "backend/test/output/encodingSpeedData.json",
  JSON.stringify(data, null, 2),
);

/**
 * @param {Format} inputFormat
 * @param {Format} outputFormat
 */
function estimate(inputFormat, outputFormat) {
  console.log();

  const result = allResults.find((res) =>
    res.inputFormat === inputFormat && res.outputFormat === outputFormat
  );
  if (result === undefined) {
    throw new Error(`no logged ${inputFormat} -> ${outputFormat} results`);
  }

  const estimatedPixels = result.inputSize * pixelsPerByte[inputFormat];
  console.log(`estimated pixels of ${inputFormat} input: ${estimatedPixels}`);
  console.log(`actual pixels of ${inputFormat} input: ${imagePixels}`);

  const estimatedTime = estimatedPixels * millisecondsPerPixel[outputFormat];
  console.log(
    `estimated time to convert ${estimatedPixels}-pixel ${inputFormat} to ${outputFormat}: ${estimatedTime}`,
  );
  console.log(
    `actual time to convert ${imagePixels}-pixel ${inputFormat} to ${outputFormat}: ${
      result.endTime - result.startTime
    }`,
  );
}
allResults.forEach((res) => estimate(res.inputFormat, res.outputFormat));
