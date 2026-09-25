#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <cstdint>
#include <cstring>

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

static std::vector<uint8_t> g_output;

val convert(val inputArray) {
    std::vector<uint8_t> input = vecFromJSArray<uint8_t>(inputArray);
 
    g_output.resize(input.size());
    for (size_t i = 0; i < input.size(); i++) {
        g_output[i] = ~input[i];
    }
    return val(typed_memory_view(g_output.size(), g_output.data()));
}
 
EMSCRIPTEN_BINDINGS(barebones_module) {
    function("convert", &convert);
}