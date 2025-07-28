import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  onSuccess: 'tsc --emitDeclarationOnly --declaration',
  esbuildOptions(options) {
    options.banner = {
      js: '// cranberrry - AI Agentic UI Framework For Frontend\n// https://github.com/Ritvyk/cranberrry\n',
    }
  },
}) 