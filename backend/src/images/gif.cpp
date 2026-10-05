#include "images/ico.hpp"
#include "variables.hpp"
#include "results.hpp"
#include "buffer.hpp"
#include "main.hpp"
#include "validation.hpp"
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "a_universal.hpp"
#include "stb_image.h"
#include "stb_image_write.h"

emscripten::val convert_to_gif(emscripten::val inputarray){
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    int width = 0, height = 0, channelz = 0;
    STB_IMG_Guard pixels = {stbi_load_from_memory(input.data(), static_cast<int>(input.size()), &width, &height, &channelz, 4)};
    Errortypes errorr = validate_image_parameters(input, width, height, channelz, pixels);
    
    if (errorr != Errortypes::None) {
        return make_error_val(errorr);
    }
}