// --- 1. MOCK CONVERTER FUNCTIONS ---
const pngToJpg = (bytes, quality) => `[JPG version (q:${quality}) of ${bytes}]`;
const jpgToSvg = (bytes, quality) => `<svg>[SVG version of ${bytes}]</svg>`;
const bmpToPng = (bytes) => `[PNG version of ${bytes}]`;

// --- 2. FORMATS & INDEXING ---
const FORMATS = ['png', 'jpg', 'bmp', 'hdr', 'tga', 'webp', 'svg'];

const INDEX = {
    png: 0,
    jpg: 1,
    bmp: 2,
    hdr: 3,
    tga: 4,
    webp: 5,
    svg: 6
};

// --- 3. TRANSITION TABLE ---
// Row = FROM, Column = TO
const conversions_transition_table = [
    // png       jpg       bmp       hdr       tga       webp      svg
    [ null,      pngToJpg, null,     null,     null,     null,     null ], // png
    [ null,      null,     null,     null,     null,     null,     jpgToSvg ], // jpg
    [ bmpToPng,  null,     null,     null,     null,     null,     null ], // bmp
    [ null,      null,     null,     null,     null,     null,     null ], // hdr
    [ null,      null,     null,     null,     null,     null,     null ], // tga
    [ null,      null,     null,     null,     null,     null,     null ], // webp
    [ null,      null,     null,     null,     null,     null,     null ]  // svg
];

// --- 4. PATHFINDER ---
function search_path(start, target) {
    if (start === target) { return []; }

    const queue = [[start, []]];
    const visited = new Set([start]);

    while (queue.length > 0) {
        const [currentindex, path] = queue.shift();
        for (let nextindex = 0; nextindex < FORMATS.length; nextindex++) {
            const func = conversions_transition_table[currentindex][nextindex];
            if (func && !visited.has(nextindex)) {
                const newstep = { from: FORMATS[currentindex], to: FORMATS[nextindex], func };
                const newpath = [...path, newstep];

                if (nextindex === target) {
                    return newpath;
                }

                visited.add(nextindex);
                queue.push([nextindex, newpath]);
            }
        }
    }
    return null; // no path found
}

// --- 5. CONVERSION CHINNER (Mocked Detector) ---
function convert_file_test(inputFormat, target_format, bytes, quality) {
    // Mocking what C++ detect_format() would return
    let current_index = INDEX[inputFormat];
    let target_index = INDEX[target_format];

    if (current_index === undefined) { 
        throw new Error(`Unsupported Input Format: "${inputFormat}"`); 
    }
    if (target_index === undefined) { 
        throw new Error(`Unsupported Output Format: "${target_format}"`); 
    }

    const path = search_path(current_index, target_index);
    if (!path) {
        throw new Error(`No valid conversion path found from "${inputFormat}" to "${target_format}".`);
    }

    return path.reduce((currentdata, step) => {
        console.log(`-> Chaining: Converting ${step.from} -> ${step.to}...`);
        return step.func(currentdata, quality);
    }, bytes);
}

// ================= RUN TESTS ================= //

try {
    console.log("=== Test 1: Direct 1-Step (png -> jpg) ===");
    const res1 = convert_file_test('png', 'jpg', "raw_png_bytes", 90);
    console.log("Result:", res1, "\n");

    console.log("=== Test 2: Chained 2-Step (bmp -> png -> jpg -> svg) ===");
    // bmp -> png (step 1), png -> jpg (step 2), jpg -> svg (step 3)
    // Let's quickly add bmp->png and png->jpg->svg into the table mentally or verify bmp path
    // Notice: bmp maps to png. png maps to jpg. jpg maps to svg. 
    // This creates: bmp -> png -> jpg -> svg (3 steps!)
    const res2 = convert_file_test('bmp', 'svg', "raw_bmp_bytes", 80);
    console.log("Result:", res2, "\n");

    console.log("=== Test 3: Invalid Path (svg -> bmp) ===");
    convert_file_test('svg', 'bmp', "raw_svg_bytes", 80);

} catch (err) {
    console.error("❌ Caught Expected Error:", err.message);
}