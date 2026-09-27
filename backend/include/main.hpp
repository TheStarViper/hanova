#pragma once
#include "results.hpp"
#include <vector>
#include <cstdint>
#include <cstring>
#include "results.hpp"
#include "variables.hpp"
#include "buffer.hpp"



struct STB_IMG_Guard;

Errortypes validate_input_size(const std::vector<uint8_t>& input);
Errortypes validate_image_dimensions(int width,int height);
std::string validate_file_format(const std::vector<uint8_t>& input);