#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "results.hpp"
#include "main.hpp"

Errortypes validate_image_parameters(const std::vector<uint8_t>& input,int width,int height,int channelz,const STB_IMG_Guard& pixels);
emscripten::val process_and_encode_image(emscripten::val inputarray,int format,int quality = 100);
