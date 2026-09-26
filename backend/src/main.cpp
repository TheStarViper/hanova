#include <emscripten/bind.h>
#include "main.hpp"
#include <emscripten/val.h>
#include <vector>
#include <cstdint>
#include <cstring>
#include "results.hpp"
#include "variables.hpp"

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

struct STB_IMG_Guard{
    uint8_t* pointer;
    ~STB_IMG_Guard() {if(pointer)stbi_image_free(pointer);}
};

static std::vector<uint8_t> g_output;


//validation guards

Errortypes validate_input_size(const std::vector<uint8_t>& input){
    if (input.size()>MAX_INPUT_BYTES){return Errortypes::FileTooLarge;}
    return Errortypes::None;
}

Errortypes validate_image_dimensions(int width,int height){
    if (width > MAX_IMG_WIDTH||height>MAX_IMG_HEIGHT){return Errortypes::DimensionalTooBig;}
    return Errortypes::None;
}

std::string validate_file_format(const std::vector<uint8_t>& input){ //verify file formats bcuz it could be a misleading file extension
    if (input.size()<12){return "unknown";}
    if (input[0]==0x89&&input[1]=='P'&&input[2]=='N'&&input[3]=='G'){return "png";}
    if (input[0]==0xFF&&input[1]==0xD8){return"jpeg";}
    if (input[0]=='B'&&input[1]=='M'){return"bmp";}
    if (input[0] == 'R' && input[1] == 'I' && input[2] == 'F' && input[3] == 'F' 
        && input[8] == 'W' && input[9] == 'A' && input[10] == 'V' && input[11] == 'E'){return "wav";}
    if (input[0] == 'R' && input[1] == 'I' && input[2] == 'F' && input[3] == 'F'
        && input[8] == 'W' && input[9] == 'E' && input[10] == 'B' && input[11] == 'P'){return "webp";}
    return "unknown";
}


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

    Errortypes size_error = validate_input_size(input);
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input)=="unknown"){return make_error_val(Errortypes::UnsupportedFormat);}

    int width,height,channelz;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), (int)input.size(), &width, &height, &channelz, 4) };
    if (!pixels.pointer){return make_error_val(Errortypes::CorruptInput);}

    Errortypes dimensional_error = validate_image_dimensions(width,height);
    if (dimensional_error!=Errortypes::None){return make_error_val(dimensional_error);}

    out; //change to global buffer
    int ok = stbi_write_png_to_func(output_buffer_write_cb, &out, width, height, 4, pixels.ptr, w * 4);
    if (!ok) return make_error_val(ConversionError::EncodeFailed);
 
    return make_success_val(out.as_val());
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