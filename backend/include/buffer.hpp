#pragma once
#include <emscripten/val.h>
#include <vector>
#include <cstdint>
#include <cstring>

class OutputBuffer{
    private:
        std::vector<uint8_t> data_;
    public:
        void clear(){data_.clear();}

        void append(const void* bytes, size_t size){
            size_t old_size = data_.size();
            data_.resize(old_size+size);
            memcpy(data_.data()+old_size,bytes,size);
        }

        emscripten::val as_val()const{
            return emscripten::val(emscripten::typed_memory_view(data_.size(),data_.data()));
        }

        size_t size() const {return data_.size();}
        const uint8_t* data() const {return data_.data();}
};

inline void output_buffer_write_callback(void* context,void* data,int size){
    reinterpret_cast<OutputBuffer*>(context)->append(data,size);
}