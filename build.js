import fs from 'fs';
import terser from 'terser';

const MINIFY = true;

const wasmBuffer = fs.readFileSync('./lib/lexer.wasm');
const jsSource = fs.readFileSync('./src/lexer.js').toString();
const pjson = JSON.parse(fs.readFileSync('./package.json').toString());

const jsSourceProcessed = jsSource.replace('WASM_BINARY', wasmBuffer.toString('base64'));

const minified = MINIFY && terser.minify(jsSourceProcessed, {
  output: {
    preamble: `/* es-module-lexer ${pjson.version} */`
  }
});

const nodeHeader = `import { TextEncoder } from 'util';`;

fs.writeFileSync('./dist/lexer.js', minified ? minified.code : jsSourceProcessed);
fs.writeFileSync('./dist/lexer.cjs.js', `${nodeHeader}${minified ? minified.code : jsSourceProcessed}`);
