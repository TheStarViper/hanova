import {
  ALIASES,
  DOMAIN,
  EVERYFORMAT,
} from "../../../backend/src/bridge/converter.mjs";
import {
  MEDIA_PRESETS,
  type QualityPreset,
} from "../../../backend/src/bridge/mediabunny-bridge.mjs";

export type Format = (typeof EVERYFORMAT)[number];

export const MEDIA_TYPES = Array.from(new Set(Object.values(DOMAIN)));
export type MediaType = (typeof MEDIA_TYPES)[number];

/** returns value normalized from 0 to 100 */
export function QualityPresetToNum(preset: QualityPreset): number {
  const idx = MEDIA_PRESETS.indexOf(preset);
  const scale = 100 / MEDIA_PRESETS.length;
  const num = idx * scale;
  return Math.round(num);
}

export const EXT_TO_FORMAT = {
  ...Object.fromEntries(EVERYFORMAT.map((f) => [f, f])),
  ...ALIASES,
};

export { initMagick } from "../../../backend/src/bridge/browserMagick.mjs";
export {
  MEDIA_PRESETS as QUALITY_PRESETS,
  type QualityPreset,
} from "../../../backend/src/bridge/mediabunny-bridge.mjs";
export {
  DOMAIN as FORMAT_TO_MEDIATYPE,
  EVERYFORMAT as FORMATS,
  universalFactory as converterFactory,
} from "../../../backend/src/bridge/orchestrator.mjs";
