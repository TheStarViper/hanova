#pragma once
#include <emscripten/val.h>
#include <vector>

emscripten::val convert_to_webp(emscripten::val inputarray, float quality);