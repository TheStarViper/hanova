#include "webp.hpp"
#include "variables.hpp"
#include "results.hpp"
#include "buffer.hpp"
#include "main.hpp"
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


EMSCRIPTEN_BINDINGS(webp_convert_module){
    emscripten::function("convert_to_webp",&convert_to_webp);
}