import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import eslint from "@rollup/plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const prod = process.env.NODE_ENV === "production";

const copyTargets = [
  {
    src: [
      "./node_modules/reveal.js/dist/reveal.css",
      "./node_modules/reveal.js/dist/reset.css",
    ],
    dest: "./css",
  },
  {
    src: "./node_modules/reveal.js/dist/theme",
    dest: "./css",
  },
  {
    src: "./node_modules/reveal.js/dist/reveal.js",
    dest: "./js",
  },
  {
    src: "./node_modules/reveal.js/plugin/**/*",
    dest: "./plugin",
  },
];

const plugins = [
  resolve(),
  commonjs(),
  eslint({
    fix: true,
    exclude: ["./node_modules/**"],
  }),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled",
  }),
  prod && terser(),
  copy({
    targets: copyTargets,
  }),
];

export default [
  {
    input: "js/revealjs-starter",
    output: {
      file: "out/revealjs-starter.js",
      format: "esm",
      name: "Reveal.js Starter",
      sourcemap: prod ? false : "inline",
    },
    plugins: plugins,
  },
];
