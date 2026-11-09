import { registerAacEncoder } from "@mediabunny/aac-encoder";
import { registerFlacEncoder } from "@mediabunny/flac-encoder";
import { registerMp3Encoder } from "@mediabunny/mp3-encoder";
import * as mediabunny from "mediabunny";
import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
import { MEDIA_INFO } from "./formats.mjs";

mediabunny.Logging.level = mediabunny.LogLevel.Warnings;
const ENCODERS = {
  mp3: registerMp3Encoder,
  flac: registerFlacEncoder,
  aac: registerAacEncoder,
};
const registered = new Map();

function ensureEncoder(codec) {
  const register = ENCODERS[codec];
  if (!register) return Promise.resolve();
  if (!registered.has(codec)) {
    registered.set(
      codec,
      (async () => {
        if (!(await mediabunny.canEncodeAudio(codec))) register();
      })(),
    );
  }
  return registered.get(codec);
}

const OUTPUT_FORMATS = {
  // video
  mp4: () => new mediabunny.Mp4OutputFormat(),
  mkv: () => new mediabunny.MkvOutputFormat(),
  webm: () => new mediabunny.WebMOutputFormat(),
  ts: () => new mediabunny.MpegTsOutputFormat(),
  mov: () => new mediabunny.MovOutputFormat(),
  m3u8: () => new mediabunny.HlsOutputFormat(),

  // audio
  mp3: () => new mediabunny.Mp3OutputFormat(),
  wav: () => new mediabunny.WavOutputFormat(),
  ogg: () => new mediabunny.OggOutputFormat(),
  flac: () => new mediabunny.FlacOutputFormat(),
  aac: () => new mediabunny.AdtsOutputFormat(),
  m4a: () => new mediabunny.Mp4OutputFormat(), // uses mp4 container
  opus: ()=> new mediabunny.OggOutputFormat(), //opus uses ogg container
};

/** @typedef {keyof PRESETS} QualityPreset */
export const PRESETS /** @type {const} */ = ({
  potato: {video: { height: 360, bitrate: mediabunny.QUALITY_VERY_LOW },audio: { bitrate: mediabunny.QUALITY_VERY_LOW },},
  low: {video: { height: 480, bitrate: mediabunny.QUALITY_LOW },audio: { bitrate: mediabunny.QUALITY_LOW },},
  balanced: {video: { height: 720, bitrate: mediabunny.QUALITY_MEDIUM },audio: { bitrate: mediabunny.QUALITY_MEDIUM },},
  high: {video: { height: 1080, bitrate: mediabunny.QUALITY_HIGH },audio: { bitrate: mediabunny.QUALITY_HIGH },},
  "very high": {video: { height: 1080, bitrate: mediabunny.QUALITY_VERY_HIGH },audio: { bitrate: mediabunny.QUALITY_VERY_HIGH },},
  max: {video: { height: 3840, bitrate: mediabunny.QUALITY_VERY_HIGH },audio: { bitrate: mediabunny.QUALITY_VERY_HIGH },},
});

/** @type {QualityPreset[]} */
export const MEDIA_PRESETS = Object.keys(PRESETS);
export const MEDIA_FORMATS = Object.keys(OUTPUT_FORMATS);

const ascii = (bytes, start, end) =>
  String.fromCharCode(...bytes.subarray(start, end));

export function detect_media_format(bytes) {
  if (!bytes || bytes.length < 12) return "unknown";

  // video
  if (ascii(bytes, 4, 8) === "ftyp") {
    const brand = ascii(bytes, 4, 8);
    if (brand === "qt  ") return "mov";
    if (brand === "M4A " || brand === "M4B ") return "m4a";
    return "mp4";
  }

  if (
    bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf
    && bytes[3] === 0xa3
  ) {
    return ascii(bytes, 0, Math.min(64, bytes.length)).includes("webm")
      ? "webm"
      : "mkv";
  }

  // audio
  if (ascii(bytes, 0, 4) === "OggS") return "ogg";
  if (ascii(bytes, 0, 4) === "fLaC") return "flac";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WAVE") {
    return "wav";
  }
  if (ascii(bytes, 0, 3) === "ID3") return "mp3";
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    return ((bytes[1] >> 1) & 3) === 0 ? "aac" : "mp3";
  }
  if (bytes[0] === 0x47 && bytes.length >= 189 && bytes[188] === 0x47) {
    return "ts";
  }
  return "unknown";
}

export async function convert_media(inputdata, target, options = {}) {
  const make = OUTPUT_FORMATS[target];
  if (!make) {
    throw new ConvertError(ErrorCode.UnsupportedOutput,
            `Unsupported media output: "${target}" (supported: ${Object.keys(OUTPUT_FORMATS).join(', ')})`);
  }

  if (options.preset && !PRESETS[options.preset]) {
    throw new ConvertError(
      ErrorCode.UnsupportedParameter,
      `Unknown preset: "${options.preset}"`,
    );
  }

  if (options.signal?.aborted) {
    throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");
  }

  const preset = PRESETS[options.preset] ?? {};
  const info = MEDIA_INFO[target];

  try {
    for (const codec of info.encoders ?? []) await ensureEncoder(codec);

    const video = info.video
      ? { ...preset.video, ...options.video }
      : { discard: true };
    const audio = {
      ...(info.audioCodec && { codec: info.audioCodec }),
      ...preset.audio,
      ...options.audio,
    };

    const input = new mediabunny.Input({
      source: new mediabunny.BufferSource(inputdata),
      formats: mediabunny.ALL_FORMATS,
    });

    const output = new mediabunny.Output({
      format: make(),
      target: new mediabunny.BufferTarget(),
    });

    const conversion = await mediabunny.Conversion.init({
      input,
      output,
      video,
      ...(Object.keys(audio).length && { audio }),
      ...(options.trim && { trim: options.trim }),
    });

    if (!conversion.isValid) {
      const reasons = conversion.discardedTracks.map((t) => t.reason).join(
        ", ",
      );
      throw new ConvertError(
        ErrorCode.NothingToConvert,
        `Nothing to convert (${reasons || "no usable tracks"})`,
      );
    }

    if (options.onProgrses) {
      conversion.onProgress = options.onProgress;
    }
    options.signal?.addEventListener("Abort", () => conversion.cancel(), {
      once: true,
    });
    await conversion.execute();

    if (options.signal?.aborted) {
      throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");
    }
    return new Uint8Array(output.target.buffer);
  } catch (error) {
    if (options.signal?.aborted) {
      throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled", {
        cause: error,
      });
    }
    throw to_convert_error(error, ErrorCode.NativeFailure);
  }
}

const AV_CODECS = {
  mp4: { video: "avc", audio: "aac" },
  mov: { video: "avc", audio: "aac" },
  ts: { video: "avc", audio: "aac" },
  mkv: { video: "avc", audio: "aac" },
  webm: { video: "vp9", audio: "opus" },
};

const asQuality = (value,fallback)=>
  value instanceof mediabunny.Quality ? value
  : typeof value === 'number' ? new mediabunny.Quality({bitrate: value})
  : new mediabunny.Quality(fallback);

export async function convert_audio_to_video(inputdata, target, options = {}) {
  const codecs = AV_CODECS[target];
  const make = OUTPUT_FORMATS[target];
  if (!codecs || !make) {
    throw new ConvertError(ErrorCode.UnsupportedOutput, `Can't make a "${target}" video from audio`);
  }
  if (typeof OfflineAudioContext === "undefined" ||
      (typeof OffscreenCanvas === "undefined" && typeof document === "undefined")) {
    throw new ConvertError(ErrorCode.EncoderUnavailable, "Making a video from audio needs a browser");
  }
  if (options.signal?.aborted) throw cancelled();

  const p = PRESETS[options.preset] ?? {};
  const height = (options.video?.height ?? p.video?.height ?? 720) & ~1;
  const width = (options.video?.width ?? Math.round((height * 16) / 9)) & ~1;
  const fps = options.fps ?? 60;
  const background = options.backgroundColor ?? "#000000";
  const waveColor = options.waveColor ?? "#00ffcc";
  const BARS = 64;

  let output;
  try {
    await ensureEncoder(codecs.audio);

    const audioBuffer = await new OfflineAudioContext(2, 1, 48000).decodeAudioData(inputdata.slice().buffer);
    const samples = audioBuffer.getChannelData(0);
    const frames = Math.max(1, Math.ceil(audioBuffer.duration * fps));

    const perFrame = Math.max(1, Math.floor(audioBuffer.sampleRate / fps));
    const frameBands = Array.from({length: frames},()=>new Float32Array(BARS));
    let highestPeak = 0;

    for (let i = 0;i<frames;i++){
      const start = i*perFrame;
      const end = Math.min(samples.length,start+perFrame);
      const windowSize = end-start;

      if (windowSize>0){
        const subChunkSize = Math.max(1,Math.floor(windowSize/BARS));
        for (let j = 0; j<BARS;j++){
          const subStart = start + j*subChunkSize;
          const subEnd = Math.min(end,subStart+subChunkSize);
          
          let sum = 0;
          for (let s = subStart;s<subEnd;s++){
            sum+=samples[s]*samples[s];
          }
          const rms = Math.sqrt(sum/(subEnd-subStart));
          frameBands[i][j]=rms;
          if (rms>highestPeak) {highestPeak=rms;}
        }
      }
    }

    const gain =highestPeak>0?1/highestPeak:1;
    const canvas = typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(width, height)
      : Object.assign(document.createElement("canvas"), { width, height });
    const ctx = canvas.getContext("2d");
    const sink = new mediabunny.BufferTarget();
    output = new mediabunny.Output({format: make(),target: sink});

    const videoSource = new mediabunny.CanvasSource(canvas, {
      codec: codecs.video,
      quality: asQuality(options.video?.bitrate ?? p.video?.bitrate,"medium"),
    });
    output.addVideoTrack(videoSource,{frameRate:fps});

    const audioSource = new mediabunny.AudioBufferSource({
      codec: codecs.audio,
      quality: asQuality(options.audio?.bitrate ?? p.audio?.bitrate,"high"),
    });
    output.addAudioTrack(audioSource);

    await output.start();
    const audioDone = audioSource.add(audioBuffer).then(()=>audioSource.close());
    const barWidth = width / BARS;
    const currentHeights = new Float32Array(BARS).fill(0);
    const smoothing = 0.35;

    for (let i = 0; i < frames; i++) {
      if (options.signal?.aborted) throw cancelled();

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = waveColor;

      for (let j = 0; j < BARS; j++) {
        const level = Math.min(1, (frameBands[i]?.[j] ?? 0) * gain);
        const targetHeight = Math.max(4, level * height * 0.75);
        
        currentHeights[j] += (targetHeight - currentHeights[j]) * smoothing;
        
        ctx.fillRect(
          j * barWidth + 2,
          height - currentHeights[j] - 20,
          Math.max(1, barWidth - 4),
          currentHeights[j]
        );
      }

      await videoSource.add(i / fps, 1 / fps);
      options.onProgress?.(i / frames);
    }
    videoSource.close();
    await audioDone;
    await output.finalize();
    return new Uint8Array(sink.buffer);
  } catch (error) {
    try { await output?.cancel?.(); } catch {}
    if (options.signal?.aborted) throw cancelled(error);
    throw to_convert_error(error, ErrorCode.NativeFailure);
  }
}

export async function probe_media(inputdata) {
  try {
    const input = new mediabunny.input({
      source: new mediabunny.BufferSource(inputdata),
      formats: mediabunny.ALL_FORMATS,
    });
    const [duration, video, audio, tags, format] = await Promise.all([
      input.computeDuration(),
      input.getPrimaryVideoTrack(),
      input.getPrimaryAudioTrack(),
      input.getMetadataTags(),
      input.getFormat(),
    ]);
    return {
      format: format?.name,
      duration,
      video: video
        && {
          codec: video.codec,
          width: video.displayWidth,
          height: video.displayHeight,
        },
      audio: audio
        && {
          codec: audio.codec,
          sampleRate: audio.sampleRate,
          channels: audio.numberOfChannels,
        },
      tags,
    };
  } catch (error) {
    throw to_convert_error(error, ErrorCode.CorruptInput);
  }
}

export async function thumbnail_at(
  inputdata,
  seconds = 0,
  { width = 320, type = "image/jpeg", quality = 0.8 } = {},
) {
  try {
    const input = new mediabunny.Input({
      source: new mediabunny.BufferSource(inputdata),
      formats: mediabunny.ALL_FORMATS,
    });
    const track = await input.getPrimaryVideoTrack;
    if (!track) {
      throw new ConvertError(ErrorCode.NothingToConvert, "file has no video");
    }

    const frame = await new mediabunny.CanvasSink(track, { width }).getCanvas(
      seconds,
    );
    if (!frame) {
      throw new ConvertEror(
        ErrorCode.NothingToConvert,
        `no frame at ${seconds}s`,
      );
    }

    const canvas = frame.canvas;
    const blob = canvas.convertToBlob
      ? await canvas.convertToBlob({ type, quality })
      : await new Promise((resolve) => canvas.toBlob(resolve, type, quality));

    return new Uint8Array(await blob.arrayBuffer());
  } catch (error) {
    throw to_convert_error(error, ErrorCode.NativeFailure);
  }
}