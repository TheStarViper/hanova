//AI FILE
import test from 'node:test';
import assert from 'node:assert/strict';
import { createConvert } from '../src/bridge/convert.mjs';
import { ConvertError, ErrorCode, guard, userMessage } from '../src/bridge/errors.mjs';

const fakes = () => ({
    image: async (target, bytes) => [...bytes, `img:${target}`],
    imageFormats: ['png', 'jpg'],
    media: async (bytes, target) => [...bytes, `media:${target}`],
    mediaFormats: ['mkv', 'webm'],
});
const bytes = new Uint8Array([1, 2, 3]);

test('routes media targets to the media engine', async () => {
    assert.deepEqual(await createConvert(fakes())(bytes, 'mkv'), [1, 2, 3, 'media:mkv']);
});

test('routes image targets to the image engine', async () => {
    assert.deepEqual(await createConvert(fakes())(bytes, 'jpg'), [1, 2, 3, 'img:jpg']);
});

test('unknown target', async () => {
    await assert.rejects(createConvert(fakes())(bytes, 'xyz'), { code: ErrorCode.UnsupportedOutput });
});

test('empty file', async () => {
    await assert.rejects(createConvert(fakes())(new Uint8Array(0), 'mkv'), { code: ErrorCode.CorruptInput });
});

test('not a Uint8Array', async () => {
    await assert.rejects(createConvert(fakes())('hello', 'mkv'), { code: ErrorCode.UnsupportedInput });
});

test('size limit', async () => {
    await assert.rejects(createConvert({ ...fakes(), maxBytes: 2 })(bytes, 'mkv'), { code: ErrorCode.TooLarge });
});

test('engine errors leave as ConvertError', async () => {
    const boom = { ...fakes(), media: async () => { throw new Error('boom'); } };
    await assert.rejects(createConvert(boom)(bytes, 'mkv'), (e) => e instanceof ConvertError && e.code === ErrorCode.NativeFailure);
});

test('missing engine means unsupported (browser build has no image engine)', async () => {
    const { image, ...mediaOnly } = fakes();
    await assert.rejects(createConvert(mediaOnly)(bytes, 'jpg'), { code: ErrorCode.UnsupportedOutput });
});

test('guard keeps an existing ConvertError', async () => {
    const original = new ConvertError(ErrorCode.NoPath, 'x');
    await assert.rejects(guard(async () => { throw original; })(), (e) => e === original);
});

test('fromJSON round trip', () => {
    const e = new ConvertError(ErrorCode.StepFailed, 'm', { step: 'a -> b' });
    const back = ConvertError.fromJSON(JSON.parse(JSON.stringify(e)));
    assert.deepEqual([back.code, back.message, back.step], [e.code, e.message, e.step]);
});

test('userMessage hides technical detail', () => {
    assert.doesNotMatch(userMessage(new Error('Open codec context: failed')), /codec context/);
});