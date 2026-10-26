import {
  ALIASES,
  DOMAIN,
  EVERYFORMAT,
} from "../../../backend/src/bridge/converter.mjs";

export type Format = (typeof EVERYFORMAT)[number];
export type MediaType = (typeof DOMAIN)[Format];

export const EXT_TO_FORMAT = {
  ...Object.fromEntries(EVERYFORMAT.map((f) => [f, f])),
  ...ALIASES,
};

export { initMagick } from "../../../backend/src/bridge/browserMagick.mjs";
export {
  DOMAIN as FORMAT_TO_MEDIATYPE,
  EVERYFORMAT as FORMATS,
  universalFactory as converterFactory,
} from "../../../backend/src/bridge/orchestrator.mjs";
