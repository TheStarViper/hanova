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
#include "nanosvg.h"
#define NANOSVGRAST_IMPLEMENTATION
#include "nanosvgrast.h"


//yoinked function
static std::string base64_encode(const uint8_t* data, size_t len){
    static const char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    std::string out;
    out.reserve(((len + 2) / 3) * 4);

    size_t i = 0;
    while(i+3<=len){
        uint32_t chunk = (data[i] << 16) | (data[i+1] << 8) | data[i+2];
        out += table[(chunk >> 18) & 0x3F];
        out += table[(chunk >> 12) & 0x3F];
        out += table[(chunk >> 6) & 0x3F];
        out += table[chunk & 0x3F];
        i += 3;
    }

    if (len - i == 1) {
        uint32_t chunk = data[i] << 16;
        out += table[(chunk >> 18) & 0x3F];
        out += table[(chunk >> 12) & 0x3F];
        out += "==";
    } else if (len - i == 2) {
        uint32_t chunk = (data[i] << 16) | (data[i+1] << 8);
        out += table[(chunk >> 18) & 0x3F];
        out += table[(chunk >> 12) & 0x3F];
        out += table[(chunk >> 6) & 0x3F];
        out += "=";
    }
    return out;
}

emscripten::val convert_svg_to_png(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    Errortypes size_error = validate_input_size(input);
    if(size_error!=Errortypes::none){
        return make_error_val(size_error);
    }

    if (validate_file_format(input)!="svg"){
        return make_error_val(Errortypes::UnsupportedFormat);
    }

    std::vector<char> svgtext(input.begin(),input.end());
    svgtext.pushback('\0');

    NSVGimage* image = nsvgParse(svgtext.data(),"px",96.0f);
    if (!image||image->width<=0||image->height<=0){
        if (image){
            nsvgDelete(image);
        }
        return make_error_val(Errortypes::CorruptInput);
    }

    int width = (int)image->widht;
    int height = (int)image->height;

    
}

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

    std::string base64 = base64_encode(pngbuffah.data(),pngbuffah.size());
    std::string svgText =
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + std::to_string(width) +
        "\" height=\"" + std::to_string(height) +
        "\" viewBox=\"0 0 " + std::to_string(width) + " " + std::to_string(height) + "\">"
        "<image width=\"" + std::to_string(width) + "\" height=\"" + std::to_string(height) +
        "\" href=\"data:image/png;base64," + base64 + "\"/></svg>";
    
    static OutputBuffer out;
    out.clear();
    out.append(svgText.data(), svgText.size());

    return make_success_val(out.as_val());
}

EMSCRIPTEN_BINDINGS(svg_convert_module){
    emscripten::function("convert_to_svg",&convert_to_svg);
}