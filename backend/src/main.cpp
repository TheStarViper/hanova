#include <cstdlib>
#include <cstring>
#include <cstdint>


// #define STB_IMAGE_IMPLEMENTATION
// #include "stb_image.h"
 
// #define STB_IMAGE_WRITE_IMPLEMENTATION
// #include "stb_image_write.h"


extern "C"{

    int allocate_buffer(int size){

    }

    void free_buffer(int* pointer){
        free(pointer);
    }

    int convert(int input, int input_length){
        int output = (int*)malloc(input_length);
        for (int i = 0; i<input_length; i++;){
            output[i] = ~input[i]
        }
        return output;
    }
}