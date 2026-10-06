
// ImageMagick-backed format identification/validation, as a second
// opinion beyond our own magic-byte sniffing — ImageMagick's own
// decoders attempt a real parse, catching malformed files our sniff
// can't (sniffing only checks the first few bytes; this actually tries
// to read the file structure).
//
// Uses MagickWand (the simpler, higher-level API) rather than raw
// MagickCore — less boilerplate for this kind of "open, inspect, close"
// use case.

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <string>
#include <cstdint>

#include <MagickWand/MagickWand.h>

static bool g_initialized = false;

static void ensure_init() {
    if (!g_initialized) {
        MagickWandGenesis();
        g_initialized = true;
    }
}
// Attempts a real decode via ImageMagick and reports what it finds —
// catches corrupt/truncated files that pass a magic-byte check but
// don't actually parse.
emscripten::val magick_identify(emscripten::val inputarray) {
    ensure_init();
    std::vector<uint8_t> input = emscripten::vecFromJSArray<uint8_t>(inputarray);

    MagickWand* wand = NewMagickWand();
    MagickBooleanType status = MagickReadImageBlob(wand, input.data(), input.size());

    emscripten::val result = emscripten::val::object();

    if (status == MagickFalse) {
        ExceptionType severity;
        char* description = MagickGetException(wand, &severity);
        result.set("ok", false);
        result.set("error", std::string(description ? description : "unknown error"));
        if (description) MagickRelinquishMemory(description);
        DestroyMagickWand(wand);
        return result;
    }

    result.set("ok", true);
    result.set("format", std::string(MagickGetImageFormat(wand)));
    result.set("width", (int)MagickGetImageWidth(wand));
    result.set("height", (int)MagickGetImageHeight(wand));

    DestroyMagickWand(wand);
    return result;
}

EMSCRIPTEN_BINDINGS(magick_validate_module) {
    emscripten::function("magick_identify", &magick_identify);
}