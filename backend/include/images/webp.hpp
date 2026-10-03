#pragma once
#include <emscripten/val.h>
#include <vector>

emscripten::val convert_to_webp(emscripten::val inputarray, float quality);
emscripten::val convert_webp_to_png(emscripten::val inputarray);