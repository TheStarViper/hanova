#include <emscripten/bind.h>
#define STB_IMAGE_IMPLEMENTATION


#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

#include "main.hpp"
#include <emscripten/val.h>


//validation guards
Errortypes validate_input_size(const std::vector<uint8_t>& input){
    if (input.size()>MAX_INPUT_BYTES){return Errortypes::FileTooLarge;}
    return Errortypes::None;
}

Errortypes validate_image_dimensions(int width,int height){
    if (width > MAX_IMG_WIDTH||height>MAX_IMG_HEIGHT){return Errortypes::DimensionalTooBig;}
    return Errortypes::None;
}


//matches magic identifiers in the hexadecimals in the files cuz like i dont wanna write input[0] == "X" 
//for every character in the identifier so this just does a full keyword at one time
bool magic_match(const std::vector<uint8_t>& input, size_t offset, const std::string& identifier){
    if (input.size()<offset+identifier.size()){return false;}
    return std::memcmp(input.data()+offset,identifier.data(),identifier.size()) ==0;
}

std::string validate_file_format(const std::vector<uint8_t>& input){ //verify file formats bcuz it could be a misleading file extension
    if (input.size()<12){return "unknown";}
    if (magic_match(input,1,"PNG")){return "png";} //dropped png byte
    if (magic_match(input,0,"\xFF\xD8")){return "jpeg";}
    if (magic_match(input,0,"BM")){return "bmp";}
    if (magic_match(input,0,"#?RADIANCE")){return"hdr";}
    if (input.size() >= 18 && magic_match(input, input.size() - 18,"TRUEVISION-XFILE.")) {
        return "tga";
    }
    //FIX these wav and webp to use the magicmatch
    if (input[0] == 'R' && input[1] == 'I' && input[2] == 'F' && input[3] == 'F' 
        && input[8] == 'W' && input[9] == 'A' && input[10] == 'V' && input[11] == 'E'){return "wav";}
    if (input[0] == 'R' && input[1] == 'I' && input[2] == 'F' && input[3] == 'F'
        && input[8] == 'W' && input[9] == 'E' && input[10] == 'B' && input[11] == 'P'){return "webp";}
    return "unknown";
}

//this is specifically for image data like width height color channels ykykyk
static uint8_t* decode(const std::vector<uint8_t>& input, int* w, int* h, int* channels) {
    return stbi_load_from_memory(input.data(), (int)input.size(),w,h,channels,4);
}

emscripten::val process_and_encode_image(emscripten::val inputarray,int format,int quality = 100){
    static OutputBuffer out;
    int ok;

    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    out.clear();

    Errortypes size_error = validate_input_size(input);
    
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input)=="unknown"){return make_error_val(Errortypes::UnsupportedFormat);}

    int width,height,channelz;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), (int)input.size(), &width, &height, &channelz, 4) };
    if (!pixels.pointer){return make_error_val(Errortypes::CorruptInput);}

    Errortypes dimensional_error = validate_image_dimensions(width,height);
    if (dimensional_error!=Errortypes::None){return make_error_val(dimensional_error);}

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