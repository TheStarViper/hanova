import {
  ALIASES,
  DOMAIN,
  EVERYFORMAT,
} from "../../../backend/src/bridge/formats.mjs";
import {
  MEDIA_PRESETS,
  type QualityPreset,
} from "../../../backend/src/bridge/mediabunny-bridge.mjs";

export const MEDIA_TYPES = Array.from(new Set(Object.values(DOMAIN)));

/** returns value normalized from 0 to 100 */
export function QualityPresetToNum(preset: QualityPreset): number {
  const idx = MEDIA_PRESETS.indexOf(preset);
  const scale = (100 - 1) / MEDIA_PRESETS.length;
  // can't let it be 0, because 0 means lossless
  const num = (idx * scale) + 1;
  return Math.round(num);
}

export const EXT_TO_FORMAT = {
  ...Object.fromEntries(EVERYFORMAT.map((f) => [f, f])),
  ...ALIASES,
};

export { initMagick } from "../../../backend/src/bridge/browserMagick.mjs";
export {
  DOMAIN as FORMAT_TO_MEDIATYPE,
  EVERYFORMAT as FORMATS,
  type Format,
  type MediaType,
} from "../../../backend/src/bridge/formats.mjs";
export {
  MEDIA_PRESETS as QUALITY_PRESETS,
  type QualityPreset,
} from "../../../backend/src/bridge/mediabunny-bridge.mjs";
export {
  universalFactory as converterFactory,
} from "../../../backend/src/bridge/orchestrator.mjs";
