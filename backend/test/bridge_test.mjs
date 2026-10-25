// AI FILE
import assert from "node:assert/strict";
import test from "node:test";
import { createconverter } from "../src/bridge/orchestrator.mjs";

// Every fake appends a tag, so the output shows which hops ran and in what order.
function makeFake(
  { detected = "png", magickDetects = null, withMagick = true } = {},
) {
  const stb = (name) => (bytes) => [...bytes, `stb:${name}`];

  const core = {
    validate_file_format: () => detected,
    convert_to_png: stb("png"),
    convert_to_jpeg: stb("jpg"),
    convert_to_bmp: stb("bmp"),
    convert_to_tga: stb("tga"),
    convert_to_hdr: stb("hdr"),
  };
  const webp = {
    convert_to_webp: (b) => [...b, "webp_enc"],
    convert_webp_to_png: (b) => [...b, "webp_dec"],
  };
  const svg = {
    convert_svg_to_png: (b) => [...b, "svg_rast"],
  };

  const magick = withMagick
    ? {
      convert_bytes: (bytes, fmt) => [...bytes, `magick:${fmt}`],
      detect_format: async () => magickDetects ?? "unknown",
      formats: {
        png: "png",
        gif: "gif",
        avif: "avif",
        tiff: "tiff",
        ico: "ico",
      },
      processors: {},
    }
    : undefined;

  return { core, webp, svg, magick };
}

const convert = (opts, target, bytes = []) =>
  createconverter(makeFake(opts)).convert_image(target, bytes, 80);

// ---- native routes (must not change when magick is added) ----

test("native hop still uses stb, not magick", async () => {
  assert.deepEqual(await convert({ detected: "png" }, "jpg"), ["stb:jpg"]);
});

test("webp -> jpg goes through png natively", async () => {
  assert.deepEqual(await convert({ detected: "webp" }, "jpg"), [
    "webp_dec",
    "stb:jpg",
  ]);
});

test("svg -> webp goes svg -> png -> webp", async () => {
  assert.deepEqual(await convert({ detected: "svg" }, "webp"), [
    "svg_rast",
    "webp_enc",
  ]);
});

test("same format returns input untouched", async () => {
  assert.deepEqual(await convert({ detected: "png" }, "png", ["x"]), ["x"]);
});

test("jpeg alias works for target", async () => {
  assert.deepEqual(await convert({ detected: "png" }, "jpeg"), ["stb:jpg"]);
});

// ---- magick routes ----

test("png -> gif goes directly through magick", async () => {
  assert.deepEqual(await convert({ detected: "png" }, "gif"), ["magick:gif"]);
});

test("jpg -> avif goes directly through magick", async () => {
  assert.deepEqual(await convert({ detected: "jpg" }, "avif"), ["magick:avif"]);
});

test("gif -> jpg: magick back to png, then stb", async () => {
  const out = await convert(
    { detected: "unknown", magickDetects: "gif" },
    "jpg",
  );
  assert.deepEqual(out, ["magick:png", "stb:jpg"]);
});

test("gif -> avif: comes back out through png", async () => {
  const out = await convert(
    { detected: "unknown", magickDetects: "gif" },
    "avif",
  );
  assert.deepEqual(out, ["magick:png", "magick:avif"]);
});

test("svg -> gif: native rasterize, then magick", async () => {
  assert.deepEqual(await convert({ detected: "svg" }, "gif"), [
    "svg_rast",
    "magick:gif",
  ]);
});

test("tiff alias on input resolves via magick detection", async () => {
  const out = await convert(
    { detected: "unknown", magickDetects: "tif" },
    "png",
  );
  assert.deepEqual(out, ["magick:png"]);
});

// ---- failures ----

test("without magick, png -> gif has no path", async () => {
  await assert.rejects(
    convert({ withMagick: false }, "gif"),
    /no conversion path/i,
  );
});

test("unknown output format is rejected", async () => {
  await assert.rejects(convert({}, "xyz"), /unsupported output/i);
});

test("unknown input is rejected when magick cannot identify it either", async () => {
  await assert.rejects(
    convert({ detected: "unknown", magickDetects: "unknown" }, "png"),
    /unsupported input/i,
  );
});

test("a failing magick hop reports which step broke", async () => {
  const fake = makeFake({ detected: "png" });
  fake.magick.convert_bytes = () => {
    throw new Error("boom");
  };
  const { convert_image } = createconverter(fake);
  await assert.rejects(convert_image("gif", [], 80), /png -> gif failed/);
});
