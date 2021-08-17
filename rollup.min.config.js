import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import json from "@rollup/plugin-json";

export default {
  input: 'dist/cjs/lambda.js',
  output: {
    dir: 'dist/bundle-min',
    format: 'cjs',
    exports: "auto",
    compact: true,
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    json(),
    cleanup({
      "comments": "none",
    }),
    terser(),
  ]
};
