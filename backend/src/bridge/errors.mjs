import fs from 'node:fs';
import { extname } from 'node:path';
import { createRequire } from 'node:module';

export const ErrorCode = Object.freeze({
    UnsupportedInput: 'UnsupportedInput',
    
})