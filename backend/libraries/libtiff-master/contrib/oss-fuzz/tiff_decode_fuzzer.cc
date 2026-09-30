/* Copyright (c) 1988-1997 Sam Leffler
 * Copyright (c) 1991-1997 Silicon Graphics, Inc.
 *
 * Permission to use, copy, modify, distribute, and sell this software and
 * its documentation for any purpose is hereby granted without fee, provided
 * that (i) the above copyright notices and this permission notice appear in
 * all copies of the software and related documentation, and (ii) the names of
 * Sam Leffler and Silicon Graphics may not be used in any advertising or
 * publicity relating to the software without the specific, prior written
 * permission of Sam Leffler and Silicon Graphics.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
 *
 * IN NO EVENT SHALL SAM LEFFLER OR SILICON GRAPHICS BE LIABLE FOR
 * ANY SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND,
 * OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER OR NOT ADVISED OF THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF
 * LIABILITY, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */

#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <sstream>
#include <tiffio.h>
#include <tiffio.hxx>

/* stolen from tiffiop.h, which is a private header so we can't just include it
 */
/* safe multiply returns either the multiplied value or 0 if it overflowed */
#define __TIFFSafeMultiply(t, v, m)                                            \
    ((((t)(m) != (t)0) && (((t)(((v) * (m)) / (m))) == (t)(v)))                \
         ? (t)((v) * (m))                                                      \
         : (t)0)

const uint64_t MAX_SIZE = 500000000;
const uint32_t MAX_STRILES = 4096;
const int MAX_DIRS = 16;

extern "C" void handle_error(const char *unused, const char *unused2,
                             va_list unused3)
{
    return;
}

static void read_striles(TIFF *tif)
{
    if (TIFFIsTiled(tif))
    {
        /* another hack to work around an OOM in tif_fax3.c */
        uint32_t tilewidth = 0;
        uint32_t imagewidth = 0;
        TIFFGetField(tif, TIFFTAG_TILEWIDTH, &tilewidth);
        TIFFGetField(tif, TIFFTAG_IMAGEWIDTH, &imagewidth);
        tilewidth = __TIFFSafeMultiply(uint32_t, tilewidth, 2);
        imagewidth = __TIFFSafeMultiply(uint32_t, imagewidth, 2);
        if (tilewidth * 2 > MAX_SIZE || imagewidth * 2 > MAX_SIZE ||
            tilewidth == 0 || imagewidth == 0)
        {
            return;
        }

        tmsize_t tilesize = TIFFTileSize(tif);
        if (tilesize <= 0 || (uint64_t)tilesize > MAX_SIZE)
        {
            return;
        }
        void *buf = _TIFFmalloc(tilesize);
        if (buf == NULL)
        {
            return;
        }
        uint32_t ntiles = TIFFNumberOfTiles(tif);
        if (ntiles > MAX_STRILES)
        {
            ntiles = MAX_STRILES;
        }
        for (uint32_t tile = 0; tile < ntiles; tile++)
        {
            TIFFReadEncodedTile(tif, tile, buf, (tmsize_t)-1);
        }
        _TIFFfree(buf);
    }
    else
    {
        // check the size of the non-tiled image
        uint32_t rowsize = 0;
        TIFFGetField(tif, TIFFTAG_ROWSPERSTRIP, &rowsize);
        uint32_t stripbytes = TIFFStripSize(tif);
        rowsize = __TIFFSafeMultiply(uint32_t, rowsize, 2);
        stripbytes = __TIFFSafeMultiply(uint32_t, stripbytes, 2);
        if (rowsize * 2 > MAX_SIZE || stripbytes * 2 > MAX_SIZE ||
            rowsize == 0 || stripbytes == 0)
        {
            return;
        }

        tmsize_t stripsize = TIFFStripSize(tif);
        if (stripsize <= 0 || (uint64_t)stripsize > MAX_SIZE)
        {
            return;
        }
        void *buf = _TIFFmalloc(stripsize);
        if (buf == NULL)
        {
            return;
        }
        uint32_t nstrips = TIFFNumberOfStrips(tif);
        if (nstrips > MAX_STRILES)
        {
            nstrips = MAX_STRILES;
        }
        for (uint32_t strip = 0; strip < nstrips; strip++)
        {
            TIFFReadEncodedStrip(tif, strip, buf, (tmsize_t)-1);
        }
        _TIFFfree(buf);
    }
}

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *Data, size_t Size)
{
#ifndef STANDALONE
    TIFFSetErrorHandler(handle_error);
    TIFFSetWarningHandler(handle_error);
#endif
#if defined(__has_feature)
#if __has_feature(memory_sanitizer)
    // libjpeg-turbo has issues with MSAN and SIMD code
    // See https://bugs.chromium.org/p/oss-fuzz/issues/detail?id=7547
    // and https://github.com/libjpeg-turbo/libjpeg-turbo/pull/365
    setenv("JSIMD_FORCENONE", "1", 1);
#endif
#endif
    std::istringstream s(std::string(Data, Data + Size));
    TIFF *tif = TIFFStreamOpen("MemTIFF", &s);
    if (!tif)
    {
        return 0;
    }

    int dirs = 0;
    do
    {
        if (++dirs > MAX_DIRS)
        {
            break;
        }

        read_striles(tif);

        uint32_t w = 0, h = 0;
        TIFFGetField(tif, TIFFTAG_IMAGEWIDTH, &w);
        TIFFGetField(tif, TIFFTAG_IMAGELENGTH, &h);
        uint32_t size = __TIFFSafeMultiply(uint32_t, w, h);
        if (size != 0 && size <= MAX_SIZE)
        {
            uint32_t *raster =
                (uint32_t *)_TIFFmalloc(size * sizeof(uint32_t));
            if (raster != NULL)
            {
                TIFFReadRGBAImageOriented(tif, w, h, raster,
                                          ORIENTATION_TOPLEFT, 0);
                _TIFFfree(raster);
            }
        }
    } while (TIFFReadDirectory(tif));

    TIFFClose(tif);
    return 0;
}
