#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <string>
#include <cstdint>
#include <cstring>
#include "main.hpp"
#include "results.hpp"
#include "variables.hpp"
#include "svg.hpp"
#include "validation.hpp"
#include "stb_image_write.h"
#include "a_universal.hpp"
#define NANOSVG_IMPLEMENTATION
#include "nanosvg/nanosvg.h"
#define NANOSVGRAST_IMPLEMENTATION
#include "nanosvg/nanosvgrast.h"

emscripten::val convert_to_svg(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    
    int width = 0, height = 0, channelz = 0;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), static_cast<int>(input.size()), &width, &height, &channelz, 4)};
    Errortypes errorr = validate_image_parameters(input, width, height, channelz, pixels);
    
    if (errorr != Errortypes::None) {
        return make_error_val(errorr);
    }
    OutputBuffer pngbuffah;
    pngbuffah.clear();
    int ok = stbi_write_png_to_func(output_buffer_write_callback,&pngbuffah,width,height,4,pixels.pointer,width*4);
    if (!ok){return make_error_val(Errortypes::EncodeFailure);}

    //uhmmmm 1 sec
}