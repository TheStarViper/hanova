#pragma once
#include "results.hpp"
#include <vector>
#include <cstdint>
#include <cstring>
#include "results.hpp"
#include "variables.hpp"
#include "buffer.hpp"

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

struct STB_IMG_Guard{
    uint8_t* pointer;
    ~STB_IMG_Guard() {if(pointer)stbi_image_free(pointer);}
};

Errortypes validate_input_size(const std::vector<uint8_t>& input);
Errortypes validate_image_dimensions(int width,int height);
std::string validate_file_format(const std::vector<uint8_t>& input);