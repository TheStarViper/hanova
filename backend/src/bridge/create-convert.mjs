import { ConvertError,to_convert_error,ErrorCode} from "./errors.mjs";
import { ALIASES } from "./formats.mjs";

export function createConvert(
  { image, imageFormats = [], 
    media, mediaFormats = [],
    doc,docFormats =  [],
    model,modelFormats=[],
    maxBytes } = {},
) {
  return async function convert(bytes, target, options = {}) {
    try {
      if (!(bytes instanceof Uint8Array)) {
        throw new ConvertError(
          ErrorCode.UnsupportedInput,
          "Expected file as Uint8Array",
        );
      }
      if (bytes.length === 0) {
        throw new ConvertError(ErrorCode.CorruptInput, "file is empty");
      }
      const limit = options.maxBytes ?? maxBytes;
      if (limit && bytes.length > limit) {
        throw new ConvertError(
          ErrorCode.TooLarge,
          `File is ${bytes.length} bytes, limit is ${limit}`,
        );
      }

      target = ALIASES[target] ?? target;
      if (media && mediaFormats.includes(target)) {
        return await media(bytes, target, options);
      }
      if (image && imageFormats.includes(target)) {
        return await image(target, bytes, options.quality ?? 80);
      }
      if (doc && docFormats.includes(target)){
        return await doc(bytes,target,options);
      }
      if (model&& modelFormats.includes(target)){
        return await model(bytes,target,options);
      }

      throw new ConvertError(
        ErrorCode.UnsupportedOutput,
        `Unsupported output format: "${target}"`,
      );
    } catch (error) {
      throw to_convert_error(error, ErrorCode.NativeFailure);
    }
  };
}
