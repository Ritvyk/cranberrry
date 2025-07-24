# Cranberrry: AI Agentic State Management Framework
##Work In Progress Wait Until Stable Release !
Cranberrry is a modern, type-safe, redux-inspired state management library for building robust AI agentic flows in frontend SaaS applications. It is framework-agnostic, React-independent, and designed for extensibility and ease of use.

## Documentation

Full documentation is now available in the [react-app documentation site](../react-app) with:
- **Installation** (npm, yarn, pnpm)
- **Playground** (try out agent/task management)
- **API Reference** (types, store, hooks)
- **Features** (agent/task management, hooks, supervisor, etc.)

## Quick Installation

Install with your favorite package manager:

### npm
```bash
npm install cranberrry
```

### yarn
```bash
yarn add cranberrry
```

### pnpm
```bash
pnpm add cranberrry
```

## Playground

Try the playground in the documentation app to experiment with agents and tasks interactively.

## API Reference

See the [API Reference](../react-app/src/components/docs/api-reference-doc.tsx) for all types, store, and hooks usage.

## Features

- Centralized, type-safe state for AI agents and their tasks
- Redux-like API: `createStore`, `dispatch`, `subscribe`, `getState`
- Only one slice: agent and task management (no user-defined reducers)
- No React or frontend framework dependency
- Modular, extensible, and robust architecture
- Utility hooks for easy integration (e.g., `useAIAgent`)

## Example Usage

```ts
import { CranberrryAgent, createStore, agentReducer, addAgent, addTask } from 'cranberrry'

const agents: CranberrryAgent[] = [
  { id: 'support-bot', name: 'Support Bot', face: '🤖', ... },
]
const store = createStore(agentReducer, { agents, tasks: [] })
store.dispatch(addAgent({ ... }))
store.dispatch(addTask({ ... }))
```

## License
ISC 