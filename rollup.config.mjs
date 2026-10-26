import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      clean: true,
      // JS bundle without TSDoc (types + docs ship in the .d.ts files)
      tsconfigOverride: { compilerOptions: { removeComments: true, declaration: false, declarationMap: false } },
    }),
  ],
  external: [],
};
