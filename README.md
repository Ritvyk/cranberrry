# Cranberrry

AI Agentic UI Framework For Frontend

## 🚀 Quick Start

### Installation

```bash
npm install cranberrry
```

### Basic Usage

```tsx
'use client'

import { useCBAgent, useCBTaskManager, CranberrryProvider, createCBStore } from 'cranberrry'

// Create a store
const store = createCBStore(CBAgentReducer, {
  agents: [],
  tasks: []
})

// Wrap your app with the provider
function App() {
  return (
    <CranberrryProvider store={store}>
      <YourApp />
    </CranberrryProvider>
  )
}

// Use the hooks in your components
function YourComponent() {
  const { agents } = useCBAgent()
  const { tasks, createTask } = useCBTaskManager()

  return (
    <div>
      <h2>Agents: {agents.length}</h2>
      <h2>Tasks: {tasks.length}</h2>
    </div>
  )
}
```

## 📦 Package Structure

The package is built with:
- **ESM** and **CJS** support
- **TypeScript** declarations
- **Tree-shaking** friendly
- **Next.js** compatible
- **React 18+** support

### Build Output

```
dist/
├── index.js      # CommonJS build
├── index.mjs     # ESM build  
├── index.d.ts    # TypeScript declarations
└── index.d.cts   # CommonJS TypeScript declarations
```

## 🔧 Configuration

### Next.js Configuration

The package is fully compatible with Next.js. No additional configuration required.

### TypeScript

The package includes full TypeScript support with comprehensive type definitions.

## 🎯 Available Hooks

### `useCBAgent()`
Returns agents state and utility functions.

```tsx
const { agents, getAgentById } = useCBAgent()
```

### `useCBTaskManager()`
Returns tasks state and task management functions.

```tsx
const { 
  tasks, 
  createTask, 
  updateTask, 
  removeTask,
  getTask,
  setTaskStatus 
} = useCBTaskManager()
```

### `useCBDispatch()`
Returns the store dispatch function.

```tsx
const dispatch = useCBDispatch()
```

### `useCBSelector(selector)`
Returns selected state from the store.

```tsx
const agents = useCBSelector(state => state.agents)
```

## 🏗️ Architecture

### Store Structure

```tsx
interface CBState {
  agents: CBAgent[]
  tasks: CBTask[]
}
```

### Agent Interface

```tsx
interface CBAgent {
  id: string
  name: string
  face?: string
  designation?: string
  description?: string
  introduction?: string
  isActive: boolean
  isAvailable: boolean
  isBusy: boolean
}
```

### Task Interface

```tsx
interface CBTask {
  id: string
  agentId: string
  input: string
  status: 'idle' | 'ongoing' | 'completed' | 'failed'
  createdAt: number
  updatedAt: number
  meta?: Record<string, any>
  response?: string
  messageBlocks?: CBMessageBlock[]
}
```

## 🔄 Recent Fixes

### Version 0.1.4
- ✅ Fixed Next.js compatibility issues
- ✅ Resolved module resolution errors
- ✅ Updated build configuration for optimal bundling
- ✅ Added proper ESM/CJS dual package support
- ✅ Fixed TypeScript declaration exports
- ✅ Removed deprecated Next.js config options
- ✅ Added `sideEffects: false` for better tree-shaking

## 🛠️ Development

### Building the Package

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions, please visit: https://github.com/Ritvyk/cranberrry/issues 
