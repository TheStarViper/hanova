// AI file
import test from 'node:test';
import assert from 'node:assert/strict';
import { createconverter } from '../src/bridge/orchestrator.mjs';


function makeFake(detectedFormat) {
    const tag = (label) => (bytes) => [...bytes, label];
    return {
        core: {
            validate_file_format: () => detectedFormat,
            stb_convert: (bytes, to) => [...bytes, `stb:${to}`],
        },
        webp: {
            convert_to_webp: tag('webp_enc'),
            convert_webp_to_png: tag('webp_dec'),
        },
        svg: {
            convert_svg_to_png: tag('svg_rast'),
        },
    };
}

test('direct stb hop', async () => {
    const { convert_image } = createconverter(makeFake('png'));
    assert.deepEqual(await convert_image('jpg', [], 80), ['stb:jpg']);
});

test('multi-hop: webp -> jpg goes through png', async () => {
    const { convert_image } = createconverter(makeFake('webp'));
    assert.deepEqual(await convert_image('jpg', [], 80), ['webp_dec', 'stb:jpg']);
});

test('svg -> webp goes svg -> png -> webp', async () => {
    const { convert_image } = createconverter(makeFake('svg'));
    assert.deepEqual(await convert_image('webp', [], 80), ['svg_rast', 'webp_enc']);
});

test('same format returns input untouched', async () => {
    const { convert_image } = createconverter(makeFake('png'));
    assert.deepEqual(await convert_image('png', ['x'], 80), ['x']);
});

test('no path: anything -> svg', async () => {
    const { convert_image } = createconverter(makeFake('png'));
    await assert.rejects(convert_image('svg', [], 80), /No conversion path/);
});

test('aliases: jpeg target works', async () => {
    const { convert_image } = createconverter(makeFake('png'));
    assert.deepEqual(await convert_image('jpeg', [], 80), ['stb:jpg']);
});

test('unknown format errors', async () => {
    const { convert_image } = createconverter(makeFake('png'));
    await assert.rejects(convert_image('gif', [], 80), /Unsupported output/);
});