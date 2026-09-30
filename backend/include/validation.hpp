#pragma once
#include "results.hpp"
#include <vector>

Errortypes validate_input_size(const std::vector<uint8_t>& input);
Errortypes validate_image_dimensions(int width,int height);