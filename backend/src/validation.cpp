#include "validation.hpp"
#include "variables.hpp"
//validation guards
Errortypes validate_input_size(const std::vector<uint8_t>& input){
    if (input.size()>MAX_INPUT_BYTES){return Errortypes::FileTooLarge;}
    return Errortypes::None;
}

Errortypes validate_image_dimensions(int width,int height){
    if (width > MAX_IMG_WIDTH||height>MAX_IMG_HEIGHT){return Errortypes::DimensionalTooBig;}
    return Errortypes::None;
}
