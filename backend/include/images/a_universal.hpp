#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>

emscripten::val process_and_encode_image(emscripten::val inputarray,int format,int quality = 100);