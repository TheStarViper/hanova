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
    static FromJSON(json){
        return new ConvertError(
            json?.code ?? ErrorCode.Unknown,
            json?.message ?? 'Unknown Error',
            {step: json?.step}
        );
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
                return new ConvertError(ErrorCode.UnsupportedOutput, `Can't write ${detail}: format is read-only or not in this build`,opts);
            case 'NoDecodeDelegateForThisImageFormat':
                return new ConvertError(ErrorCode.UnsupportedInput,`Can't read ${detail}: format is not supported`,opts);
            case 'WidthOrHeightExceedsLimit':
                return new ConvertError(ErrorCode.TooLarge,`Image is too large for this format (ICO max is 256x256)`,opts);
            default:
                return new ConvertError(ErrorCode.NativeFailure,`${code}${detail ? ` (${detail})` : ''}`, opts);
        }
    }

    //embind error structure
    if (error?.name==='BindingError'||error?.name==='UnboundTypeError'){
        return new ConvertError(ErrorCode.NativeFailure,`embind: ${first}`,opts);
    }

    //webcodecccs
    if(error?.name==='AbortError'){return new ConvertError(ErrorCode.Cancelled, 'Conversion was cancelled', opts);}
    if(error?.name==='NotSupportedError'){return new ConvertError(ErrorCode.EncoderUnavailable, first, opts);}
    if(error?.name==='EncodingError'||error?.name==='DataError'){return new ConvertError(ErrorCode.CorruptInput, first, opts);}

    //out of memory
    if (
        (err instanceof RangeError && /memory|allocation|invalid (typed )?array length/i.test(message)) ||
        /cannot enlarge memory|aborted\(oom\)|out of memory/i.test(message)
    ) {
        return new ConvertError(ErrorCode.TooLarge, 'Not enough memory for this file', opts);
    }

    //mediabunny
    if (/cannot (be )?(decoded|encoded)|no (decoder|encoder)|unsupported codec|not supported/i.test(message)) {
        return new ConvertError(ErrorCode.EncoderUnavailable, first, opts);
    }
    if (/invalid|malformed|unexpected end|failed to parse|not a valid/i.test(message)) {
        return new ConvertError(ErrorCode.CorruptInput, first, opts);
    }

    return new ConvertError(fallbackcode, `${err?.name ?? 'Error'}: ${first}`, opts);//uhhhhhh wtf
}

export const simplify_error=(error)=>to_convert_error(error).message;

export function guard(fn,fallbackcode = ErrorCode.Unknown){
    return async (...args)=>{
        try {
            return await fn(...args);
        } catch(error) {
            throw to_convert_error(error,fallbackcode);
        }
    };
}

const USER_MESSAGES = { //front end user messages
    [ErrorCode.UnsupportedInput]: "This file type isnt supported",
    [ErrorCode.UnsupportedOutput]: "We dont support conversions to this file",
    [ErrorCode.NoPath]: "No route to travel to convert these formats",
    [ErrorCode.StepFailed]: "One hop in conversion chaining failed",
    [ErrorCode.NativeFailure]: "Something went wrong with one of our libraries whist converting this file",
    [ErrorCode.CorruptInput]: "This file is damaged/corrupted",
    [ErrorCode.EncoderUnavailable]: "Encoder Unavailable, try another browser/format",
    [ErrorCode.NothingToConvert]: "File appears empty",
    [ErrorCode.TooLarge]: "File too large (scale like image size/video length)",
    [ErrorCode.FileTooBig]: "Filesize too large (max: undefined yet FIX)",
    [ErrorCode.Cancelled]: "Conversion canceled",
    [ErrorCode.Unknown]: "idk bruh smth got cooked no idea what happened u shouldnt even be seeing this msg",
};

export function usermessage(error){
    const e = to_convert_error(error);
    return USER_MESSAGES[e.code]??USER_MESSAGES[ErrorCode.Unknown];
}

export function installglobalerrorhandlers(onError = (errorrrrrrr)=>console.error(errorrrrrrr.code,errorrrrrrr.message,errorrrrrrr.cause)){
    if (typeof window !== 'undefined'){
        window.addEventListener('unhandledrejection',(ev)=>{onError(to_convert_error(ev.reason));ev.preventDefault();});
        window.addEventListener('error',(ev)=>onError(to_convert_error(ev.error ?? ev.message)));
    } else if (typeof process !=='undefined'){
        process.on('unhandledRejection',(reason)=>onError(to_convert_error(reason)));
        process.on('uncaughtException',(errorrrrrrr)=>onError(to_convert_error(errorrrrrrr)));
    }
}