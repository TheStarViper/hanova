#include "a_universal.hpp"
#include <vector>
#include "buffer.hpp"
#include "variables.hpp"
#include "validation.hpp"
#include "stb_image.h"
#include "stb_image_write.h"
#include "main.hpp"

emscripten::val validate_image_parameters(std::vector<uint8_t> input,int width,int height,int channelz,STB_IMG_Guard pixels){
    Errortypes size_error = validate_input_size(input);
    
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input)=="unknown"){return make_error_val(Errortypes::UnsupportedFormat);}
    
    if (!pixels.pointer){return make_error_val(Errortypes::CorruptInput);}

    Errortypes dimensional_error = validate_image_dimensions(width,height);
    if (dimensional_error!=Errortypes::None){return make_error_val(dimensional_error);}
    return;
}

emscripten::val process_and_encode_image(emscripten::val inputarray,int format,int quality){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    
    int width,height,channelz;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), (int)input.size(), &width, &height, &channelz, 4) };
    validate_image_parameters(input,&width,&height,&channelz,&pixels);

    static OutputBuffer out;
    int ok;
    out.clear();
    switch(format){
        case 0: //png
            ok = stbi_write_png_to_func(output_buffer_write_callback, &out, width, height, 4, pixels.pointer, width * 4);
            break;
        case 1: //jpeg
            ok = stbi_write_jpg_to_func(output_buffer_write_callback, &out, width, height, 4, pixels.pointer, quality);
            break;
        case 2: //bmp
            ok = stbi_write_bmp_to_func(output_buffer_write_callback, &out, width, height, 4, pixels.pointer);
            break;
        case 3: //tga
            ok = stbi_write_tga_to_func(output_buffer_write_callback, &out, width, height, 4, pixels.pointer);
            break;
        default:
            return make_error_val(Errortypes::UnsupportedFormat);
    }
    if (!ok) return make_error_val(Errortypes::EncodeFailure);
    return make_success_val(out.as_val());
}
