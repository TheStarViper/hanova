import createModule from '../../frontend/src/lib/cpp/cpp_module.js'

async function main(){
    const Module = await createModule();

    const input = new Uint8Array([0,1,2,523,92,192,293]);
    console.log('input: ',Array.from(input));

    const view = Module.convert(input);
    const output = new Uint8Array(view);

    console.log('output: ',Array.from(output));
}

main().catch((err) => {
    console.error('Error: ', err);
    process.exit(1);
});