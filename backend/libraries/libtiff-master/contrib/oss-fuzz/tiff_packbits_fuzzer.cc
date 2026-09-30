/*
 * Copyright (c) 2026 Anthony Adame
 *
 * Permission to use, copy, modify, distribute, and sell this software and
 * its documentation for any purpose is hereby granted without fee, provided
 * that (i) the above copyright notice and this permission notice appear in
 * all copies of the software and related documentation, and (ii) the name of
 * the author may not be used in any advertising or publicity relating to the
 * software without the specific, prior written permission of the author.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
 *
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND,
 * OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER OR NOT ADVISED OF THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF
 * LIABILITY, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */

/*
 * Targeted fuzzer for the PackBits decoder (tif_packbits.c).
 *
 * Feeding raw bytes to a whole-file TIFF fuzzer rarely reaches a specific
 * codec: almost every input dies in header/IFD parsing first. This harness
 * instead synthesises a minimal, always-valid single-strip TIFF container in
 * memory and uses the fuzz input as the *compressed strip payload*, so every
 * iteration reaches PackBitsDecode() with an attacker-controlled bitstream.
 *
 * A few leading bytes select the image geometry, which varies the size of the
 * output buffer the decoder must not overrun (the `occ` cursor) independently
 * of the payload it is decoding -- that pairing is what exercises the bounds
 * logic. Dimensions are clamped so the decoded strip stays small and the
 * fuzzer reports real memory errors rather than out-of-memory.
 */

#include <cstddef>
#include <cstdint>
#include <cstring>

#include <vector>

#include <fuzzer/FuzzedDataProvider.h>

#include "tiffio.h"

/* Keep the decoded strip small: OOM is not the bug class under test. */
static const uint32_t kMaxWidth = 1024;
static const uint32_t kMaxHeight = 64;

namespace
{

/* ---- in-memory TIFF client ------------------------------------------- */

struct MemFile
{
    const uint8_t *data;
    toff_t size;
    toff_t pos;
};

tmsize_t memRead(thandle_t handle, void *buf, tmsize_t want)
{
    MemFile *m = static_cast<MemFile *>(handle);
    if (want < 0 || m->pos >= m->size)
        return 0;
    toff_t avail = m->size - m->pos;
    if (static_cast<toff_t>(want) > avail)
        want = static_cast<tmsize_t>(avail);
    memcpy(buf, m->data + m->pos, static_cast<size_t>(want));
    m->pos += static_cast<toff_t>(want);
    return want;
}

tmsize_t memWrite(thandle_t, void *, tmsize_t) { return 0; }

toff_t memSeek(thandle_t handle, toff_t off, int whence)
{
    MemFile *m = static_cast<MemFile *>(handle);
    toff_t base;
    switch (whence)
    {
        case SEEK_SET:
            base = 0;
            break;
        case SEEK_CUR:
            base = m->pos;
            break;
        case SEEK_END:
            base = m->size;
            break;
        default:
            return static_cast<toff_t>(-1);
    }
    /* Refuse wrap-around rather than silently aliasing a valid offset. */
    if (off > static_cast<toff_t>(-1) - base)
        return static_cast<toff_t>(-1);
    m->pos = base + off;
    return m->pos;
}

int memClose(thandle_t) { return 0; }

toff_t memSize(thandle_t handle)
{
    return static_cast<MemFile *>(handle)->size;
}

/* memMap/memUnmap are passed as null: libtiff substitutes no-op stubs. */

/* ---- quiet libtiff diagnostics --------------------------------------- */

void silentError(const char *, const char *, va_list) {}
void silentWarning(const char *, const char *, va_list) {}

/* ---- minimal little-endian TIFF writer -------------------------------- */

void put16(std::vector<uint8_t> &v, uint16_t x)
{
    v.push_back(static_cast<uint8_t>(x & 0xff));
    v.push_back(static_cast<uint8_t>((x >> 8) & 0xff));
}

void put32(std::vector<uint8_t> &v, uint32_t x)
{
    v.push_back(static_cast<uint8_t>(x & 0xff));
    v.push_back(static_cast<uint8_t>((x >> 8) & 0xff));
    v.push_back(static_cast<uint8_t>((x >> 16) & 0xff));
    v.push_back(static_cast<uint8_t>((x >> 24) & 0xff));
}

void putEntry(std::vector<uint8_t> &v, uint16_t tag, uint16_t type,
              uint32_t count, uint32_t value)
{
    put16(v, tag);
    put16(v, type);
    put32(v, count);
    /* Single SHORT/LONG values fit inline; little-endian puts a SHORT in the
     * first two bytes of the field, so writing the full word is correct. */
    put32(v, value);
}

#define TIFF_TYPE_SHORT 3
#define TIFF_TYPE_LONG 4

/* 9 directory entries, one strip, 8-bit grayscale, PackBits-compressed. */
#define ENTRY_COUNT 9
#define IFD_OFFSET 8
#define IFD_BYTES (2 + (ENTRY_COUNT * 12) + 4)
#define STRIP_OFFSET (IFD_OFFSET + IFD_BYTES)

std::vector<uint8_t> buildPackBitsTiff(uint32_t width, uint32_t height,
                                       const std::vector<uint8_t> &payload)
{
    std::vector<uint8_t> t;
    t.reserve(STRIP_OFFSET + payload.size());

    /* Header: little-endian, classic TIFF, IFD immediately after. */
    t.push_back('I');
    t.push_back('I');
    put16(t, 42);
    put32(t, IFD_OFFSET);

    put16(t, ENTRY_COUNT); /* entries must be in ascending tag order */
    putEntry(t, 256, TIFF_TYPE_LONG, 1, width);  /* ImageWidth      */
    putEntry(t, 257, TIFF_TYPE_LONG, 1, height); /* ImageLength     */
    putEntry(t, 258, TIFF_TYPE_SHORT, 1, 8);     /* BitsPerSample   */
    putEntry(t, 259, TIFF_TYPE_SHORT, 1, COMPRESSION_PACKBITS);
    putEntry(t, 262, TIFF_TYPE_SHORT, 1, PHOTOMETRIC_MINISBLACK);
    putEntry(t, 273, TIFF_TYPE_LONG, 1, STRIP_OFFSET); /* StripOffsets    */
    putEntry(t, 277, TIFF_TYPE_SHORT, 1, 1);           /* SamplesPerPixel */
    putEntry(t, 278, TIFF_TYPE_LONG, 1, height);       /* RowsPerStrip    */
    putEntry(t, 279, TIFF_TYPE_LONG, 1,
             static_cast<uint32_t>(payload.size())); /* StripByteCounts */
    put32(t, 0);                                     /* no next IFD     */

    t.insert(t.end(), payload.begin(), payload.end());
    return t;
}

} /* namespace */

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size)
{
    FuzzedDataProvider fdp(data, size);

    const uint32_t width = fdp.ConsumeIntegralInRange<uint32_t>(1, kMaxWidth);
    const uint32_t height = fdp.ConsumeIntegralInRange<uint32_t>(1, kMaxHeight);

    const std::vector<uint8_t> payload = fdp.ConsumeRemainingBytes<uint8_t>();
    if (payload.empty())
        return 0;

    const std::vector<uint8_t> tiff = buildPackBitsTiff(width, height, payload);

    TIFFSetErrorHandler(silentError);
    TIFFSetWarningHandler(silentWarning);

    MemFile mem;
    mem.data = tiff.data();
    mem.size = static_cast<toff_t>(tiff.size());
    mem.pos = 0;

    TIFF *tif = TIFFClientOpen("packbits_fuzz", "r",
                               static_cast<thandle_t>(&mem), memRead, memWrite,
                               memSeek, memClose, memSize, nullptr, nullptr);
    if (!tif)
        return 0;

    const tmsize_t stripSize = TIFFStripSize(tif);
    if (stripSize > 0)
    {
        void *buf = _TIFFmalloc(stripSize);
        if (buf)
        {
            /* The decode itself: PackBitsDecode() expands `payload` into a
             * buffer of exactly stripSize bytes and must not step outside it.
             */
            TIFFReadEncodedStrip(tif, 0, buf, stripSize);
            _TIFFfree(buf);
        }
    }

    TIFFClose(tif);
    return 0;
}
