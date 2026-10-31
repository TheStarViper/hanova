import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";

const FFMPEG_AUDIO = {
    mp3: ["-c:a","libmp3lame", "-f","mp3"],
    wav: ["-c:a","pcm_s16le", "-f","wav"],
    ogg: ["-c:a","libopus", "-f","ogg"],
    flac: ["-c:a","flac", "-f","flac"],
    aac: ["-c:a","aac", "-f","adts"],
    m4a: ["-c:a","aac", "-f","ipod"],
    aiff: ["-c:a","pcm_s16be", "-f","aiff"],
    au: ["-c:a","pcm_s16be", "-f","au"],
    caf: ["-c:a","pcm_s16le", "-f","caf"],
    ac3: ["-c:a","ac3", "-f","ac3"],
    mp2: ["-c:a","mp2", "-f","mp2"],
    wma: ["-c:a","wmav2", "-f","asf"],
};

let ffmpegPromise;
function load(){
    
}