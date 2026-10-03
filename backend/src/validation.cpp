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
    if (magic_match(input,0,"RIFF") && magic_match(input,8,"WEBP")){return "webp";} //webp is based on riff
    
    //FIX these wav and webp to use the magicmatch
    if (input[0] == 'R' && input[1] == 'I' && input[2] == 'F' && input[3] == 'F' 
        && input[8] == 'W' && input[9] == 'A' && input[10] == 'V' && input[11] == 'E'){return "wav";}
    if (input[0] == 'R' && input[1] == 'I' && input[2] == 'F' && input[3] == 'F'
        && input[8] == 'W' && input[9] == 'E' && input[10] == 'B' && input[11] == 'P'){return "webp";}
    return "unknown";
}