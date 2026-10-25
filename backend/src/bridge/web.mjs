import { createconverter, createConvert, VIDEO_FORMATS, AUDIO_FORMATS } from './converter.mjs';
import * as mediabridge from './mediabunny-bridge.mjs';

const media = {
    convert_media: mediabridge.convert_media,
    detect_format: mediabridge.detect_media_format,
};

export const {convert_video,convert_audio}