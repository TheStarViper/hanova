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

emscripten::val convert_to_png(emscripten::val inputarray){
    return process_and_encode_image(inputarray,0);
}

emscripten::val convert_to_jpeg(emscripten::val inputarray, int quality){ //quality 1-100
    return process_and_encode_image(inputarray,1,quality);
}

//convert to bmp
emscripten::val convert_to_bmp(emscripten::val inputarray){
    return process_and_encode_image(inputarray,2);
}

emscripten::val convert_to_tga(emscripten::val inputarray){
    return process_and_encode_image(inputarray,3);
}


emscripten::val convert_to_hdr(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    Errortypes size_error = validate_input_size(input);
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input)=="unknown"){return make_error_val(Errortypes::UnsupportedFormat);}

    int width,height,channelz;
    float* pixels = stbi_loadf_from_memory(input.data(), (int)input.size(), &width, &height, &channelz, 4);
    if (!pixels){return make_error_val(Errortypes::CorruptInput);}

    Errortypes dimensional_error = validate_image_dimensions(width,height);
    if (dimensional_error!=Errortypes::None){
        stbi_image_free(pixels);
        return make_error_val(dimensional_error);
    }

    static OutputBuffer out;
    out.clear();
    int ok = stbi_write_hdr_to_func(output_buffer_write_callback, &out, width, height, 4, pixels);
    stbi_image_free(pixels);
    if (!ok) {return make_error_val(Errortypes::EncodeFailure);}

    return make_success_val(out.as_val());
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
    emscripten::function("convert_to_png", &convert_to_png);
    emscripten::function("convert_to_jpeg", &convert_to_jpeg);
    emscripten::function("convert_to_bmp", &convert_to_bmp);
    emscripten::function("convert_to_tga", &convert_to_tga);
    emscripten::function("convert_to_hdr", &convert_to_hdr);
    emscripten::function("get_image_width", &get_image_width);
    emscripten::function("get_image_height", &get_image_height);
}