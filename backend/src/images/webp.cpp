#include "webp.hpp"
#include "variables.hpp"
#include "results.hpp"
#include "buffer.hpp"
#include "main.hpp"
#include "validation.hpp"
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include "stb_image.h"
#include "stb_image_write.h"
#include <webp/encode.h>
#include <webp/decode.h>


emscripten::val convert_to_webp(emscripten::val inputarray,float quality){ //1-100 quality
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    Errortypes size_error = validate_input_size(input);
    
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input)=="unknown"){return make_error_val(Errortypes::UnsupportedFormat);}

    int width,height,channelz;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), (int)input.size(), &width, &height, &channelz, 4) };
    if (!pixels.pointer){return make_error_val(Errortypes::CorruptInput);}

    Errortypes dimensional_error = validate_image_dimensions(width,height);
    if (dimensional_error!=Errortypes::None){return make_error_val(dimensional_error);}

    uint8_t* webp_data = nullptr;
    size_t webp_size = WebPEncodeRGBA(pixels.pointer,width,height,width*4,quality,&webp_data);
    
    if (webp_size==0){
        return make_error_val(Errortypes::EncodeFailure);
        //shit
    }

    emscripten::val view = emscripten::val(emscripten::typed_memory_view(webp_size,webp_data));
    emscripten::val result = make_success_val(view);
    WebPFree(webp_data);
    return result;
}


//webp to png cuz cant convert directly from webp to other forms in current setup so webp -> png -> some other format
//like how the UN communicates cuz i watched that HAI video where this is how the translators work
emscripten::val convert_webp_to_png(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    Errortypes size_error = validate_input_size(input);
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input) != "webp"){
        return make_error_val(Errortypes::UnsupportedFormat);
    }

    int width,height;
    uint8_t* pixels = WebPDecodeRGBA(input.data(),input.size(),&width,&height);
    if (!pixels){return make_error_val(Errortypes::CorruptInput);}

    Errortypes dimensional_error = validate_image_dimensions(width,height);
    if (dimensional_error!=Errortypes::None){
        WebPFree(pixels);
        return make_error_val(dimensional_error);
    }

    static OutputBuffer out;
    out.clear();
    int ok = stbi_write_png_to_func(output_buffer_write_callback, &out, width, height, 4, pixels,width*4);
    WebPFree(pixels);

    if (!ok) {return make_error_val(Errortypes::EncodeFailure);}
    return make_success_val(out.as_val());
}

EMSCRIPTEN_BINDINGS(webp_convert_module){
    emscripten::function("convert_to_webp",&convert_to_webp);
    emscripten::function("convert_webp_to_png",&convert_webp_to_png);
}