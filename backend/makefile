CXX = em++
CC = emcc
BUILD_DIR = ../frontend/src/lib/cpp
OBJ_DIR = obj
TARGET = $(BUILD_DIR)/cpp_module.js
TSD_OUT = cpp_module.d.ts

WEBP_SRCS = $(wildcard libraries/libwebp/src/enc/*.c) \
            $(wildcard libraries/libwebp/src/dec/*.c) \
            $(wildcard libraries/libwebp/src/dsp/*.c) \
            $(wildcard libraries/libwebp/src/utils/*.c)

CPP_SRCS = $(wildcard src/*.cpp) $(wildcard src/*/*.cpp)

WEBP_OBJS = $(patsubst %.c,$(OBJ_DIR)/%.o,$(WEBP_SRCS))
CPP_OBJS  = $(patsubst %.cpp,$(OBJ_DIR)/%.o,$(CPP_SRCS))

INC = -Iinclude -Isrc -Ilibraries/libwebp/src -Ilibraries/libwebp -Iinclude/images

CFLAGS   = -O2
CXXFLAGS = -O2 -std=c++20

EMFLAGS = --bind \
          --emit-tsd $(TSD_OUT) \
          -o $(TARGET) \
          -s WASM=1 \
          -s MODULARIZE=1 \
          -s EXPORT_ES6=1 \
          -s ENVIRONMENT="web,node" \
          -s ALLOW_MEMORY_GROWTH=1 \
          -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']"

ifeq ($(OS),Windows_NT)
    MKDIR = if not exist $(subst /,\,$(BUILD_DIR)) mkdir $(subst /,\,$(BUILD_DIR))
    RM = if exist $(subst /,\,$(BUILD_DIR)) rmdir /s /q $(subst /,\,$(BUILD_DIR))
    RM_OBJ = if exist $(OBJ_DIR) rmdir /s /q $(OBJ_DIR)
    MKDIR_P = if not exist "$(subst /,\,$(1))" mkdir "$(subst /,\,$(1))"
else
    MKDIR = mkdir -p $(BUILD_DIR)
    RM = rm -rf $(BUILD_DIR)
    RM_OBJ = rm -rf $(OBJ_DIR)
    MKDIR_P = mkdir -p $(1)
endif

.PHONY: all setup build clean

all: setup build

setup:
	@$(MKDIR)

$(OBJ_DIR)/%.o: %.c
	@$(call MKDIR_P,$(dir $@))
	$(CC) -c $< $(INC) $(CFLAGS) -o $@

$(OBJ_DIR)/%.o: %.cpp
	@$(call MKDIR_P,$(dir $@))
	$(CXX) -c $< $(INC) $(CXXFLAGS) -o $@

build: $(CPP_OBJS) $(WEBP_OBJS)
	@echo "==============================================================================================="
	@echo "[1/1] Creating WASM Module..."
	$(CXX) $(CPP_OBJS) $(WEBP_OBJS) $(EMFLAGS)
	@echo "==============================================================================================="

clean:
	@$(RM)
	@$(RM_OBJ)