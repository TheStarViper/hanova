#pragma once

#include <emscripten/bind.h>
#include <emscripten/val.h>

emscripten::val convert_to_png(emscripten::val inputarray);
emscripten::val convert_to_jpeg(emscripten::val inputarray, int quality);
emscripten::val convert_to_bmp(emscripten::val inputarray);
emscripten::val convert_to_tga(emscripten::val inputarray);
emscripten::val convert_to_hdr(emscripten::val inputarray);