#pragma once 
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <cstdint>
#include <cstring>
#pragma pack(push, 1)

struct ICOHeader{
    uint16_t reserved = 0;
    uint16_t type =1;
    uint16_t count =1; 
};

struct ICODirEntry{ // ico directory entry
    uint8_t width;
    uint8_t height;
    uint8_t color_count=0;
    uint8_t reserved=0;
    uint16_t planes = 1;
    uint16_t bit_count = 32;
    uint32_t bytes_in_res;
    uint32_t offset;
};

#pragma pack(pop)

emscripten::val convert_to_ico(emscripten::val inputarray);