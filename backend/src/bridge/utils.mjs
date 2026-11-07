import { ConvertError, ErrorCode } from "./errors.mjs";
import { ALIASES } from "./formats.mjs";

export const has_media_options = (o) => Boolean(o.preset || o.trim || o.video || o.audio);

export const format_from_filename = (name) =>{
  const ext = String(name).split(".").pop().toLowerCase();
  return ALIASES[ext]??ext;
};

export const unwrap = (r) => {
    if (Array.isArray(r) || r instanceof Uint8Array) return r;
    if (r && r.ok === false) {
      throw new ConvertError(
        ErrorCode.NativeFailure,
        `native conversion failed: ${
          r.error ?? r.errorType ?? "unknown error"
        }`,
      );
    }

    if (r?.data instanceof Uint8Array) {
      const out = r.data.slice();
      r.delete?.();
      return out;
    }
    throw new ConvertError(
      ErrorCode.NativeFailure,
      `unexpected native result: ${Object.keys(r ?? {})}`,
    );
  };

export const use = (engine) => (typeof engine ==="function"?engine():engine);