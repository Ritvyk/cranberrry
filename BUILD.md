# Cranberrry Package Build Guide

## Overview

This package is built using **tsup**, a modern TypeScript bundler that provides fast, optimized builds with both CommonJS and ESM outputs.

## Build Configuration

### Key Features
- ✅ **Dual Output**: Both CommonJS (`.cjs`) and ESM (`.js`) formats
- ✅ **TypeScript Declarations**: Automatic `.d.ts` generation
- ✅ **Source Maps**: For debugging support
- ✅ **Tree Shaking**: Optimized bundle size
- ✅ **External Dependencies**: React and React-DOM are externalized

### Build Scripts

```bash
# Build the package
npm run build

# Development mode with watch
npm run dev

# Clean build artifacts
npm run clean

# Type checking only
npm run typecheck

# Prepare for publishing (clean + build)
npm run prepublishOnly

# Publish to npm (build + publish)
npm run publish

# Dry run publish (test without publishing)
npm run publish:dry-run
```

### Output Structure

```
dist/
├── index.js          # ESM bundle
├── index.cjs         # CommonJS bundle
├── index.d.ts        # TypeScript declarations
├── index.d.cts       # CommonJS TypeScript declarations
└── *.map             # Source maps
```

## Package.json Configuration

### Entry Points
- **main**: `./dist/index.js` (CommonJS)
- **module**: `./dist/index.mjs` (ESM)
- **types**: `./dist/index.d.ts` (TypeScript declarations)

### Exports
The package supports both ESM and CommonJS imports:

```javascript
// ESM
import { createCBStore } from 'cranberrry';

// CommonJS
const { createCBStore } = require('cranberrry');
```

## Publishing

### Quick Publish
```bash
npm run publish
```
This command will:
1. Clean previous builds
2. Build the package
3. Publish to npm

### Test Publish (Dry Run)
```bash
npm run publish:dry-run
```
This command will:
1. Clean previous builds
2. Build the package
3. Show what would be published (without actually publishing)

### Manual Publishing
1. **Build**: `npm run build`
2. **Test**: Verify the build works
3. **Publish**: `npm publish`

The `prepublishOnly` script ensures a clean build before publishing.

## Development

- Use `npm run dev` for development with watch mode
- Use `npm run typecheck` for TypeScript checking
- The build process automatically handles all TypeScript compilation

## Dependencies

### Production
- `mitt`: Event emitter
- `nanoid`: ID generation
- `react`: React framework

### Development
- `tsup`: TypeScript bundler
- `typescript`: TypeScript compiler
- `@types/react`: React type definitions
- `@types/react-dom`: React DOM type definitions 