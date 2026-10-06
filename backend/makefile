CXX = em++
CC = emcc
BUILD_DIR = ../frontend/src/lib/cpp
OBJ_DIR = obj

INC = -Iinclude -Isrc -Ilibraries/libwebp/src -Ilibraries/libwebp -Iinclude/images -Ilibraries/stb -Ilibraries/nanosvg

CXXFLAGS = -Oz -std=c++20 -flto
CFLAGS   = -Oz -flto

COMMON_EMFLAGS = --bind \
          -Oz \
          -flto \
          -s WASM=1 \
          -s MODULARIZE=1 \
          -s EXPORT_ES6=1 \
          -s ENVIRONMENT="web,node,worker" \
          -s ALLOW_MEMORY_GROWTH=1 \
          -s FILESYSTEM=0 \
          -s ASSERTIONS=0 \
          --strip-all \
          --closure 1 \

echo_color = powershell -Command "Write-Host $(1) -ForegroundColor $(2)"


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


UNIVERSAL_DEPENENCY_SRCS = src/images/a_universal.cpp src/results.cpp src/validation.cpp src/stbstuff.cpp src/main.cpp 

# CORE ------------------------------------------------------------------------------------------------------------------------------
ALL_CPP_SRCS = $(wildcard src/*.cpp) $(wildcard src/*/*.cpp)

CORE_CPP_SRCS = $(filter-out \
				 src/images/webp.cpp \
				 src/images/svg.cpp \
				 src/images/magick_test.cpp \
				, $(ALL_CPP_SRCS))


CORE_OBJS = $(patsubst %.cpp,$(OBJ_DIR)/%.o,$(CORE_CPP_SRCS))
CORE_TARGET = $(BUILD_DIR)/image_core_module.js
CORE_TSD = image_core_module.d.ts

# WEBP -----------------------------------------------------------------------------------------------------------------------------------------
WEBP_LIB_SRCS = $(wildcard libraries/libwebp/src/enc/*.c) \
            $(wildcard libraries/libwebp/src/dec/*.c) \
            $(wildcard libraries/libwebp/src/dsp/*.c) \
            $(wildcard libraries/libwebp/src/utils/*.c) \
            $(wildcard libraries/libwebp/sharpyuv/*.c)
WEBP_CPP_SRCS = src/images/webp.cpp 
WEBP_OBJS = $(patsubst %.c,$(OBJ_DIR)/%.o,$(WEBP_LIB_SRCS)) \
            $(patsubst %.cpp,$(OBJ_DIR)/%.o,$(WEBP_CPP_SRCS)) \
            $(patsubst %.cpp,$(OBJ_DIR)/%.o,$(UNIVERSAL_DEPENENCY_SRCS))
WEBP_TARGET = $(BUILD_DIR)/webp_module.js
WEBP_TSD = webp_module.d.ts

# SVG ----------------------------------------------------------------------------------------------------------------------------
SVG_CPP_SRCS = src/images/svg.cpp 
SVG_OBJS = $(patsubst %.cpp,$(OBJ_DIR)/%.o,$(SVG_CPP_SRCS))\
			$(patsubst %.cpp,$(OBJ_DIR)/%.o,$(UNIVERSAL_DEPENENCY_SRCS))
SVG_TARGET = $(BUILD_DIR)/svg_module.js
SVG_TSD = svg_module.d.ts

# IMAGE MAGICK ----------------------------------------------------------------------------------------------------------------
MAGICK_DIR = libraries/imagemagick_build
MAGICK_LIB = libraries/imagemagick_build/MagickCore/.libs/libMagickCore-7.Q16HDRI.a libraries/imagemagick_build/MagickWand/.libs/libMagickWand-7.Q16HDRI.a
MAGICK_INC = -Ilibraries/imagemagick_build -Ilibraries/imagemagick_build/MagickCore -Ilibraries/imagemagick_build/MagickWand
MAGICK_DEFINES = -DMAGICKCORE_HDRI_ENABLE=1 -DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_CHANNEL_MASK_DEPTH=32
MAGICK_CPP_SRCS = src/images/magick_test.cpp
MAGICK_OBJS = $(patsubst %.cpp,$(OBJ_DIR)/%.o,$(MAGICK_CPP_SRCS))
MAGICK_TARGET = $(BUILD_DIR)/magick_module.js
MAGICK_TSD = magick_module.d.ts

MAGICK_EMFLAGS = --bind \
          -O2 \
          -s WASM=1 \
          -s MODULARIZE=1 \
          -s EXPORT_ES6=1 \
          -s ENVIRONMENT="web,node" \
          -s ALLOW_MEMORY_GROWTH=1 \
          -s ASSERTIONS=0 \
          --preload-file $(MAGICK_DIR)/config@/magick_config

$(OBJ_DIR)/src/images/magick_test.o: src/images/magick_test.cpp
	@$(call MKDIR_P,$(dir $@))
	$(CXX) -c $< $(INC) $(MAGICK_INC) $(MAGICK_DEFINES) $(CXXFLAGS) -o $@


.PHONY: all setup build-core build-webp build-magick clean 

all: setup build-core build-webp build-svg build-magick success

setup:
	@$(MKDIR)

$(OBJ_DIR)/%.o: %.c
	@$(call MKDIR_P,$(dir $@))
	$(CC) -c $< $(INC) $(CFLAGS) -o $@

$(OBJ_DIR)/%.o: %.cpp
	@$(call MKDIR_P,$(dir $@))
	$(CXX) -c $< $(INC) $(CXXFLAGS) -o $@

build-core: $(CORE_OBJS)
	@echo "==============================================================================================="
	@$(call echo_color, "[1/4] Creating image_core WASM Module...", "Cyan")
	$(CXX) $(CORE_OBJS) --emit-tsd $(CORE_TSD) -o $(CORE_TARGET) $(COMMON_EMFLAGS)
	@echo "==============================================================================================="
	@$(call echo_color, "[1/4] image_core SUCCESSFULLY CREATED!", "Blue") # blue prints purple for some reason?

build-webp: $(WEBP_OBJS)
	@echo "==============================================================================================="
	@$(call echo_color, "[2/4] Creating webp WASM Module...", "Cyan")
	$(CXX) $(WEBP_OBJS) --emit-tsd $(WEBP_TSD) -o $(WEBP_TARGET) $(COMMON_EMFLAGS)
	@echo "==============================================================================================="
	@$(call echo_color, "[2/4] webp SUCCESSFULLY CREATED!", "Blue")

build-svg: $(SVG_OBJS)
	@echo "==============================================================================================="
	@$(call echo_color, "[3/4] Creating svg WASM Module...", "Cyan")
	$(CXX) $(SVG_OBJS) --emit-tsd $(SVG_TSD) -o $(SVG_TARGET) $(COMMON_EMFLAGS)
	@echo "==============================================================================================="
	@$(call echo_color, "[3/4] svg SUCCESSFULLY CREATED!", "Blue")

build-magick: $(MAGICK_OBJS)
	@echo "==============================================================================================="
	@$(call echo_color, "[4/4] Creating magick WASM Module...", "Cyan")
	$(CXX) $(MAGICK_OBJS) $(MAGICK_LIB) --emit-tsd $(MAGICK_TSD) -o $(MAGICK_TARGET) $(MAGICK_EMFLAGS)
	@echo "==============================================================================================="
	@$(call echo_color, "[4/4] magick SUCCESSFULLY CREATED!", "Blue")

clean:
	@$(RM)
	@$(RM_OBJ)

success:
	@$(call echo_color, "ALL BUILDS SUCCESSFUL!", "Yellow")
	@$(call echo_color, "node backend/test/run.mjs for testing", "Yellow")
	@$(call echo_color, "node backend/test/test_magick.mjs for testing magick", "Yellow")
    # just to make sure i dont miss it idk