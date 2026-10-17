import fs from 'node:fs';
import { extname } from 'node:path';
import { createRequire } from 'node:module';

export const ErrorCode = Object.freeze({
    UnsupportedInput: 'UnsupportedInput',
    UnsupportedOutput: 'UnsupportedOutput',
    NoPath: 'NoPath', //both known no conversion chain path between two
    StepFailed: 'StepFailed', //one hop in conversion chaining failed
    NativeFailure: 'NativeFailure', //C++/imagemagick/mediabunny/etc error
    CorruptInput: 'CorruptInput', //you will never guess
    EncoderUnavailable: 'EncoderUnavailable',
    NothingToConvert: 'NothingToConvert',
    TooLarge: 'TooLarge', //too big scale
    FileTooBig: 'FileTooBig',
    Cancelled: 'Cancelled',
    Unknown: 'Unknown',
});

export class ConvertError extends Error{
    constructor(code,message,{step,cause}={}){
        super(message,cause!==undefined?{cause}:undefined);
        this.name = 'ConvertError';
        this.code = code;
        this.step = step;
    }

    toJSON(){
        return {code: this.code, message: this.message, step: this.step };
    }
}

export function to_convert_error(error,fallbackcode=ErrorCode.Unknown,{step}={}){
    if(error instanceof ConvertError) {return error;}

    const opts = {step,cause: error};
    const message = String(error?.message??error);
    const first = message.split('\n')[0];

    if (typeof error ==='number'){
        return new ConvertError(ErrorCode.NativeFailure, `C++ exception thrown (pointer ${err})`, opts);
    }


    //imagemagick error structure
    const magick = /^(\w+)\s*(?:`([^']*)')?\s*@/.exec(message);
    if (magick){
        const [,code,detail='']=magick;
        switch (code){
            case 'NoEncodeDelegateForThisImageFormat': 
                return new ImageError(ErrorCode.UnsupportedOutput, `Can't write ${detail}: format is read-only or not in this build`,opts);
            case 'NoDecodeDelegateForThisImageFormat':
                return new ImageError(ErrorCode.UnsupportedInput,`Can't read ${detail}: format is not supported`,opts);
            case 'WidthOrHeightExceedsLimit':
                return new ImageError(ErrorCode.TooLarge,`Image is too large for this format (ICO max is 256x256)`,opts);
            default:
                return new ImageError(ErrorCode.NativeFailure,`${code}${detail ? ` (${detail})` : ''}`, opts);
        }
    }

    //embind error structure
    
}
