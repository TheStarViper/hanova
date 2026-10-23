#include "validation.hpp"
#include "variables.hpp"
#include <emscripten/val.h>
#include <emscripten/bind.h>

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
    //IMAGE FORMATS
    if (input.size()<12){return "unknown";}
    if (magic_match(input,1,"PNG")){return "png";}                                                      //dropped png byte btw
    if (magic_match(input,0,"\xFF\xD8")){return "jpeg";}                                                //jpeg
    if (magic_match(input,0,"BM")){return "bmp";}                                                       //bmp
    if (magic_match(input,0,"#?RADIANCE")){return"hdr";}                                                //hdr
    if (input.size() >= 18 && magic_match(input, input.size() - 18,"TRUEVISION-XFILE.")) {return "tga";}//tga
    if (magic_match(input,0,"RIFF") && magic_match(input,8,"WEBP")){return "webp";}                     //webp is based on riff
    if (magic_match(input,0,"GIF8")){return "gif";}                                                     //gif
    if (magic_match(input,4,"ftypavif")){return "avif";}                                                //avif
    if (magic_match(input,0,"ftypheic")){return "heic";}                                                //heic
    if (magic_match(input,4,"JXL")){return "jxl";}                                                      //jxl
    if (magic_match(input,0,"qoif")){return "qoi";}                                                     //qoi
    if (magic_match(input,0,"8BPS")){return "psd";}                                                     //psd
    if (magic_match(input,0,"v/1")){return "exr";}                                                      //exr

    //svg cuz it doesnt ahve magic numbers
    size_t svgScanLen = input.size() < 512 ? input.size() : 512;
    std::string svgHead(input.begin(), input.begin() + svgScanLen);
    if (svgHead.find("<svg") != std::string::npos) return "svg";
    //end of svg


    //DOCUMENT FORMATS
    //AUDIO FORMATS
    //VIDEO FORMATS
    return "unknown";
}


std::string validate_file_format_js(const emscripten::val& input) {
    return validate_file_format(emscripten::convertJSArrayToNumberVector<uint8_t>(input));
}

EMSCRIPTEN_BINDINGS(validation_module) {
    emscripten::function("validate_file_format", &validate_file_format_js);
}