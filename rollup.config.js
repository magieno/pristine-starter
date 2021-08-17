import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import json from "@rollup/plugin-json";

export default {
  input: 'dist/esm/lambda.js',
  output: {
    dir: 'dist/bundle',
    format: 'cjs',
    exports: "auto",
    compact: true,
  },
  external: [
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
    json(),
    cleanup({
      "comments": "none",
    }),
  ]
};
