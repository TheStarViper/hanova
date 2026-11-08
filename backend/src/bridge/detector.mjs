import { ALIASES } from "./formats.mjs";

const ascii = (bytes,start,end)=>String.fromCharCode(...bytes.subarray(start,end));
const latin1 = (bytes,start,end) => new TextDecoder("latin1").decode(bytes.subarray(start,end));
const skipBom = (bytes) => (bytes[0]===0xef &&
                            bytes[1]===0xbb &&
                            bytes[2]===0xbf ? 3 : 0
);

export function detect_model_format(bytes){
  if (!bytes||bytes.length<16) return "unknown";
  const head = ascii(bytes,0,Math.min(bytes.length,24));
  const view = new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);

  if (head.startsWith("glTF")) {return "glb";}
  if (head.startsWith("Kaydara FBX Binary")) {return "fbx";}
  if (head.startsWith("BLENDER")) {return "blend";}
  if (/^ply\r?\n/.test(head)) {return "ply";}
  if (/^(ST|C|N|4|n)*OFF\r?\n/.test(head)) {return "off";}
  if (head.startsWith("xof ")) {return "x";}

  if (bytes[0]===0x4d&&
      bytes[1]===0x4d&&
      view.getUint32(2, true) === bytes.length
  ) {return "3ds";}
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {// zip: 3mf is a zip with a model part
    return latin1(bytes, Math.max(0, bytes.length - 65536), bytes.length).includes("3D/3dmodel.model") ? "3mf" : "unknown";
  }

  if (bytes.length >= 84) {
    const count = view.getUint32(80, true);
    if (count > 0 && 84 + count * 50 === bytes.length) return "stl";
  }

  const start = skipBom(bytes);
  const text = latin1(bytes,start,Math.min(bytes.length,start+4096)).trimStart();
  if (/^solid[\s\S]*\bfacet\b/.test(text)) {return "stl";}
  if (text.includes("<COLLADA")) return "dae";
  if (text.startsWith("{") && /"asset"\s*:/.test(text) && /"version"/.test(text)) return "gltf";
  if (/^v\s+[-\d.]/m.test(text) && /^(f|vn|vt|o|g|mtllib|usemtl)\s/m.test(text)) return "obj";
  return "unknown";
}

export function detect_media_format(bytes) {
  if (!bytes || bytes.length < 12) return "unknown";

  // video
  if (ascii(bytes, 4, 8) === "ftyp") {
    const brand = ascii(bytes, 8, 12);
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
  if (bytes[0] === 0x47 && bytes.length >= 189 && bytes[188] === 0x47) {
    return "ts";
  }

  //ffmpeg audio
  if (ascii(bytes,0,4)==="FORM"&&ascii(bytes,8,12)==="AIFF"){return "aiff";}
  if (ascii(bytes,0,4)===".snd"){return "au";}
  if (ascii(bytes,0,4)==="caff"){return "caf";}
  if (bytes[0]===0x0b&&bytes[1]===0x77){return "ac3";}
  if (bytes[0]===0x30&&bytes[1]===0x26&&bytes[2]===0xb2&&bytes[3]===0x75){return "wma";}
  if (bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0){
    const layer = (bytes[1]>>1)&3;
    return layer ===0?"aac":layer ===2?"mp2":"mp3";
  }
  if(ascii(bytes,0,5)==="#!AMR"){return "amr";}
  if(ascii(bytes,0,4)==="TTA1"){return "tta";}
  return "unknown";
}

export function detect_document_format(bytes) {
  if (!bytes || bytes.length < 8) return "unknown";

  if (bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 3 || bytes[2] === 5)) {
    const head = latin1(bytes, 0, Math.min(bytes.length, 1024));
    if (head.includes("application/epub+zip")) return "epub";
    if (head.includes("application/vnd.oasis.opendocument.text")) return "odt";
    const tail = latin1(bytes, Math.max(0, bytes.length - 65536), bytes.length);
    if (tail.includes("word/document.xml")) return "docx";
    if (tail.includes("ppt/presentation.xml")) return "pptx";
    return "unknown";
  }

  const start = skipBom(bytes);
  const text = latin1(bytes, start, Math.min(bytes.length, start + 1024)).trimStart();

  if (text.startsWith("%PDF")) return "pdf";
  if (text.startsWith("{\\rtf")) return "rtf";
  if (text.includes("<FictionBook")) return "fb2";
  if (/<opml[\s>]/i.test(text)) return "opml";
  if (text.startsWith("{") && text.includes('"nbformat"')) return "ipynb";
  if (/^<!doctype html|^<html/i.test(text)) return "html";
  if (/^\\documentclass|^\\begin\{document\}/.test(text)) return "tex";
  return "unknown";
}

export function detect_svg(bytes){
  if (!bytes||bytes.length<5) {return "unknown";}
  const start = skipBom(bytes);
  const head = latin1(bytes,start,Math.min(bytes.length,start+16384));
  return /<svg[\s>]/.test(head)?"svg":"unknown";
}