#include "results.hpp"
#include <emscripten/val.h>
#include <string>

const char* error_msg(Errortypes error){
    switch (error){
        case Errortypes::None: return "";
        case Errortypes::CorruptInput: return "file appears corrupted";
        case Errortypes::FileTooLarge: return "file exceeds max supported size";
        case Errortypes::UnsupportedFormat: return "unsupported / unrecognised file format";
        case Errortypes::EncodeFailure: return "encoding failed";
        case Errortypes::DimensionalTooBig: return "image exceeds maximum supported dimension";
    }
}

emscripten::val make_error_val(Errortypes error){
    emscripten::val result = emscripten::val::object();
    result.set("ok",false);
    result.set("error", std::string(error_msg(error)));
    return result;
}

emscripten::val make_success_val(emscripten::val bytes){
    emscripten::val result = emscripten::val::object();
    result.set("ok",true);
    result.set("data", bytes);
    return result;
}