#pragma once
#include <emscripten/val.h>

enum Errortypes{
    None,
    UnsupportedFormat,
    FileTooLarge,
    CorruptInput,
    EncodeFailure
};

const char* error_msg(Errortypes error);
emscripten::val make_error_val(Errortypes error);
emscripten::val make_success_val(emscripten::val bytes);