import createcore from '../../build/image_core_module.js';
import createwebp from '../../build/webp_module.js';
import createsvg from '../../build/svg_module.js';
import * as bridge from './imagemagick-bridge.mjs';
import * as mediabridge from './mediabunny-bridge.mjs';
import {
    createconverter, createConvert,
    IMAGE_FORMATS, VIDEO_FORMATS, AUDIO_FORMATS,
} from './converter.mjs';

const magick = {
    convert_bytes: bridge.convert_bytes,
    detect_format: bridge.detect_format,
    formats: bridge.MAGICK_BY_NAME,
    outputonly: bridge.MAGICK_OUTPUT_ONLY,
    processors: bridge.MAGICK_PROCESSORS,
};

const media = {
    convert_media: mediabridge.convert_media,
    detect_format: mediabridge.detect_media_format,
};

const [core, webp, svg] = await Promise.all([createcore(), createwebp(), createsvg()]);

export const { convert_image, convert_video, convert_audio, capabilities, search_path } =
    createconverter({ core, webp, svg, magick, media });

export const convert = createConvert({
    image: convert_image,
    imageFormats: IMAGE_FORMATS,
    media: (bytes, target, options) =>
        (AUDIO_FORMATS.includes(target) ? convert_audio : convert_video)(target, bytes, options),
    mediaFormats: [...VIDEO_FORMATS, ...AUDIO_FORMATS],
});

export { IMAGE_FORMATS, VIDEO_FORMATS, AUDIO_FORMATS, FORMATS } from './converter.mjs';