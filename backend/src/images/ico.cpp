#include "images/ico.hpp"
#include "variables.hpp"
#include "results.hpp"
#include "buffer.hpp"
#include "main.hpp"
#include <emscripten/bind.h>
#include <emscripten/val.h>

#include "stb_image.h"
#include "stb_image_write.h"

emscripten::val convert_to_ico(emscripten::val inputarray){
    static OutputBuffer out;
    static OutputBuffer ICOout;

    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);
    out.clear();
    ICOout.clear();

    Errortypes size_error = validate_input_size(input);
    
    if (size_error != Errortypes::None){return make_error_val(size_error);}

    if (validate_file_format(input)=="unknown"){return make_error_val(Errortypes::UnsupportedFormat);}

    int width,height,channelz;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), (int)input.size(), &width, &height, &channelz, 4) };
    if (!pixels.pointer){return make_error_val(Errortypes::CorruptInput);}

    if (width>256||height>256){return make_error_val(Errortypes::DimensionalTooBig);}

    int ok = stbi_write_png_to_func(output_buffer_write_callback, &out, width, height, 4, pixels.pointer,width*4);
    if (!ok) {return make_error_val(Errortypes::EncodeFailure);}

    ICOHeader header{};
    ICODirEntry entry{};
    entry.width = (width >=256)?0:(uint8_t)width;
    entry.height = (height >=256)?0:(uint8_t)height;
    entry.bytes_in_res = (uint32_t)out.size();
    entry.offset = sizeof(ICOHeader) + sizeof(ICODirEntry);

    ICOout.append(&header,sizeof(header));
    ICOout.append(&entry,sizeof(entry));
    ICOout.append(out.data(),out.size());

    return make_success_val(ICOout.as_val());
}

EMSCRIPTEN_BINDINGS(ico_convert_module){
    emscripten::function("convert_to_ico",&convert_to_ico);
}