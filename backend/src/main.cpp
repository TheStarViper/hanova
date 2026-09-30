#include <emscripten/bind.h>
#define STB_IMAGE_IMPLEMENTATION

#include "a_universal.hpp"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

#include "main.hpp"
#include <emscripten/val.h>


//this is specifically for image data like width height color channels ykykyk
static uint8_t* decode(const std::vector<uint8_t>& input, int* w, int* h, int* channels) {
    return stbi_load_from_memory(input.data(), (int)input.size(),w,h,channels,4);
}

int get_image_width(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    if (validate_input_size(input) != Errortypes::None) return -1;

    int width,height,channelz;
    if (!stbi_info_from_memory(input.data(),(int)input.size(),&width,&height,&channelz)) {return -1;}
    return width;
}

int get_image_height(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    if (validate_input_size(input) != Errortypes::None) return -1;

    int width,height,channelz;
    if (!stbi_info_from_memory(input.data(),(int)input.size(),&width,&height,&channelz)) {return -1;}
    return height;
}

EMSCRIPTEN_BINDINGS(image_convert_module) {
    emscripten::function("get_image_width", &get_image_width);
    emscripten::function("get_image_height", &get_image_height);
}