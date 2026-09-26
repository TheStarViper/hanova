#pragma once

enum Errortypes{
    None,
    UnsupportedFormat,
    FileTooLarge,
    CorruptInput,
    EncodeFailure
};

const char* error_msg(Errortypes error);