import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    }
  },
  esbuildOptions(options) {
    options.banner = {
      js: '// cranberrry - AI Agentic UI Framework For Frontend\n// https://github.com/Ritvyk/cranberrry\n',
    }
  },
}) 