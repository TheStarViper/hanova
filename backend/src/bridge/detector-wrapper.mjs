import { ALIASES } from "./formats.mjs";
import { detect_model_format,detect_media_format,detect_document_format,detect_svg } from "./detector.mjs";
import { use } from "./utils.mjs";

export function createDetector({media,docs,core,magick}){
    return async function detect(bytes){
        let format = "unknown";
        if (media) {format = detect_media_format(bytes);}
        if (format ==="unknown" && docs) {format = detect_document_format(bytes);}
        if (format ==="unknown") {format = detect_svg(bytes);}
        if (format ==="unknown") {format = detect_model_format(bytes);}
        if (format ==="unknown"&&core) {format = (await use(core)).validate_file_format(bytes);}
        if (format ==="unknown"&&magick) {format = await magick.detect_format(bytes);}
        return ALIASES[format]??format;
    };
}