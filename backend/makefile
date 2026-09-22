CXX = em++
BUILD_DIR = ../frontend/src/lib/cpp
TARGET = $(BUILD_DIR)/cpp_module.js
TSD_OUT = cpp_module.d.ts

SRCS = $(wildcard src/*.cpp) $(wildcard src/*/*.cpp)
INC = -Iinclude -Isrc

CXXFLAGS = -O2 -std=c++20

EMFLAGS = --emit-tsd $(TSD_OUT) \
          -o $(TARGET) \
          -s WASM=1 \
          -s MODULARIZE=1 \
          -s EXPORT_ES6=1 \
          -s ENVIRONMENT="web,node" \
          -s ALLOW_MEMORY_GROWTH=1 \
          -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
          --preload-file assets


# Platform detection for clean/setup commands
ifeq ($(OS),Windows_NT)
    MKDIR = if not exist $(subst /,\,$(BUILD_DIR)) mkdir $(subst /,\,$(BUILD_DIR))
    RM = if exist $(subst /,\,$(BUILD_DIR)) rmdir /s /q $(subst /,\,$(BUILD_DIR))
else
    MKDIR = mkdir -p $(BUILD_DIR)
    RM = rm -rf $(BUILD_DIR)
endif

.PHONY: all setup build clean

all: setup build

setup:
	@$(MKDIR)

build:
	@echo "==============================================================================================="
    @$(call echo_color, "[1/1] Building C++ into WASM Module...", "Cyan")
    Write-Host $("[1/1] Building C++ into WASM Module...") -ForegroundColor $(2)
	$(CXX) $(SRCS) $(INC) $(CXXFLAGS) $(EMFLAGS)
	@echo "==============================================================================================="

clean:
	@$(RM)
