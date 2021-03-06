import ts from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/flashed.js',
        format: 'umd',
        path: 'dist',
        name: 'flashed',
    },
    plugins: [
        ts({
            // lib: ["es5", "es6", "dom"],
            // target: 'es5'
        })
    ]
}