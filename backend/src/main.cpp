#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <cstdint>
#include <cstring>

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

static std::vector<uint8_t> g_output;


static void write_cb(void* context, void* data, int size){
    (void)context;
    size_t old_size = g_output.size();
    g_output.resize(old_size  + size);
    memcpy(g_output.data() + old_size, data, size);
}

//this is specifically for image data like width height color channels ykykyk
static uint8_t* decode(const std::vector<uint8_t>& input, int* w, int* h, int* channels) {
    return stbi_load_from_memory(input.data(), (int)input.size(),w,h,channels,4);
}

//yo this converts to png
emscripten::val convert_to_png(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    int width,height,channelz;
    uint8_t* pixels = decode(input,&width,&height,&channelz);
    if (!pixels){return emscripten::val::null();}


    g_output.clear();
    int ok = stbi_write_png_to_func(write_cb,nullptr,width,height,4,pixels,width*4);
    stbi_image_free(pixels);

    if (!ok){return emscripten::val::null();}
    return emscripten::val(emscripten::typed_memory_view(g_output.size(),g_output.data()));
}

//yo this convert to jpeg
emscripten::val convert_to_jpeg(emscripten::val inputarray, int quality){ //quality 1-100
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    int width,height,channelz;
    uint8_t* pixels = decode(input,&width,&height,&channelz);
    if (!pixels){return emscripten::val::null();}


    g_output.clear();
    int ok = stbi_write_jpg_to_func(write_cb,nullptr,width,height,4,pixels,quality);
    stbi_image_free(pixels);

    if (!ok){return emscripten::val::null();}
    return emscripten::val(emscripten::typed_memory_view(g_output.size(),g_output.data()));
}

//convert to bmp
emscripten::val convert_to_bmp(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    int width,height,channelz;
    uint8_t* pixels = decode(input,&width,&height,&channelz);
    if (!pixels){return emscripten::val::null();}


    g_output.clear();
    int ok = stbi_write_bmp_to_func(write_cb,nullptr,width,height,4,pixels);
    stbi_image_free(pixels);

    if (!ok){return emscripten::val::null();}
    return emscripten::val(emscripten::typed_memory_view(g_output.size(),g_output.data()));
}

int get_image_width(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    int width,height,channelz;
    if (!stbi_info_from_memory(input.data(),(int)input.size(),&width,&height,&channelz)) {return -1;}
    return width;
}

int get_image_height(emscripten::val inputarray){
        std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    int width,height,channelz;
    if (!stbi_info_from_memory(input.data(),(int)input.size(),&width,&height,&channelz)) {return -1;}
    return height;
}

EMSCRIPTEN_BINDINGS(image_convert_module) {
    emscripten::function("convert_to_png", &convert_to_png);
    emscripten::function("convert_to_jpeg", &convert_to_jpeg);
    emscripten::function("convert_to_bmp", &convert_to_bmp);
    emscripten::function("get_image_width", &get_image_width);
    emscripten::function("get_image_height", &get_image_height);
}