# Cranberrry: AI Agentic State Management Framework

Cranberrry is a modern, type-safe, redux-inspired state management library for building robust AI agentic flows in frontend SaaS applications. It is framework-agnostic, React-independent, and designed for extensibility and ease of use.

## Features
- Centralized, type-safe state for AI agents and their tasks
- Redux-like API: `createStore`, `dispatch`, `subscribe`, `getState`
- Only one slice: agent and task management (no user-defined reducers)
- No React or frontend framework dependency
- Modular, extensible, and robust architecture
- Utility hooks for easy integration (e.g., `useAIAgent`)

## Installation
```sh
npm install cranberrry
```

## Quick Start

### 1. Define Your Agents
```ts
import { CranberrryAgent } from 'cranberrry';

const agents: CranberrryAgent[] = [
  {
    id: 'support-bot',
    name: 'Support Bot',
    linkedSupportApplication: 'slack',
    face: '🤖',
    designation: 'AI Support',
    description: 'Handles support queries',
    introduction: 'Hi! I am your support bot.',
    isActive: true,
    isAvailable: true,
    isBusy: false,
  },
  // ...more agents
];
```

### 2. Initialize the Store
```ts
import { createStore, agentReducer, CranberrryState } from 'cranberrry';

const initialState: CranberrryState = { agents, tasks: [] };
const store = createStore(agentReducer, initialState);
```

### 3. Manage Agents & Tasks
```ts
import { addAgent, updateAgent, addTask, updateTask, removeTask, getTasksForAgent } from 'cranberrry';

store.dispatch(addAgent({ /* ...agent */ }));
store.dispatch(updateAgent({ id: 'support-bot', isBusy: true }));
store.dispatch(addTask({ /* ...task */ }));
store.dispatch(updateTask({ id: 'task-1', status: 'completed' }));
store.dispatch(removeTask('task-1'));

const tasksForAgent = getTasksForAgent(store.getState(), 'support-bot');
```

### 4. Subscribe to State Changes
```ts
const unsubscribe = store.subscribe(() => {
  console.log('State changed:', store.getState());
});
```

### 5. Use the `useAIAgent` Hook (Framework Agnostic)
```ts
import { useAIAgent } from 'cranberrry';

const unsubscribe = useAIAgent(store, ({ agents, getAgentById }) => {
  console.log('Agents:', agents);
  const agent = getAgentById('support-bot');
});
```

## API Reference

### Types
- `CranberrryAgent` — AI agent definition
- `CranberrryAgentTask` — Task for an agent
- `CranberrryState` — State shape
- `CranberrryAction` — Action types

### Store
- `createStore(reducer, preloadedState)` — Create a new store
- `store.getState()` — Get current state
- `store.dispatch(action)` — Dispatch an action
- `store.subscribe(listener)` — Subscribe to state changes

### Agent Slice
- `agentReducer` — Reducer for agents and tasks
- `addAgent(agent)` — Action creator
- `updateAgent(agent)` — Action creator
- `addTask(task)` — Action creator
- `updateTask(task)` — Action creator
- `removeTask(id)` — Action creator
- `getTasksForAgent(state, agentId)` — Utility

### Hooks
- `useAIAgent(store, onChange)` — Subscribe to agents and get a getter for a specific agent

## Design Principles
- **Type Safety**: All APIs are strictly typed with TypeScript
- **No React Dependency**: Use in any frontend framework
- **Single Slice**: Only agent/task management, no user-defined reducers
- **Extensible**: Modular structure for future hooks and features

## License
ISC 

---

## Generic AI Agent Task API

### Overview

This package provides a generic, type-safe, and modular system for managing AI agent tasks and parsing structured output blocks (e.g., <conversation>, <content-block>) from LLMs or other AI agents. You can easily spin off tasks, register callbacks for specific output blocks, and manage agent task state in your React app.

### Key Concepts
- **Block Parsing:** The agent supervisor parses output for any tags you specify (e.g., <conversation>, <content-block>), and triggers your callbacks when those blocks are found.
- **Callbacks:** Register callbacks for any tag/block, as well as for task completion and errors.
- **Hooks:** Use `useAgentController` for a high-level API, or `useAgentSupervisor`/`useAgentTaskManager` for lower-level control.

---

### Example Usage

#### 1. useAgentController (Recommended)
```tsx
import { useAgentController } from "@cranberrry/package/hooks/useAgentController";

const MyComponent = () => {
  const { startAgentTask, isRunning, error, handleData } = useAgentController({
    agentId: "my-agent",
    tags: ["conversation", "content-block"],
    callbacks: {
      conversation: (block) => {
        // Handle <conversation> block
        console.log("Conversation block:", block);
      },
      "content-block": (block) => {
        // Handle <content-block> block
        console.log("Content block:", block);
      },
      onComplete: () => {
        // Task completed
        alert("Task completed!");
      },
      onError: (err) => {
        // Handle error
        alert("Error: " + err);
      },
    },
  });

  // To start a task:
  const handleStart = () => {
    startAgentTask("Write a summary of today's news.");
  };

  // To feed data chunks (e.g., from a streaming API):
  // handleData(chunk);

  return (
    <div>
      <button onClick={handleStart} disabled={isRunning}>Start Task</button>
      {error && <div>Error: {error}</div>}
    </div>
  );
};
```

#### 2. useAgentSupervisor (Lower-level)
```tsx
import { useAgentSupervisor } from "@cranberrry/package/hooks/useAgentSupervisor";

const { status, startTask, handleData, complete, error, reset } = useAgentSupervisor(["conversation", "content-block"]);
// Use startTask, handleData, etc. as needed
```

#### 3. useAgentTaskManager (Task State)
```tsx
import { useAgentTaskManager } from "@cranberrry/package/hooks/useAgentTaskManager";

const { tasks, createTask, updateTask, removeTask, getTask, setTaskStatus } = useAgentTaskManager();
// Manage agent tasks in your UI
```

---

### How It Works
- You instruct your LLM/agent to wrap output in tags (e.g., <conversation>...</conversation>).
- The supervisor parses the output stream for these tags and triggers your registered callbacks.
- You can handle each block as you wish (render UI, update state, etc.).
- All logic is generic and type-safe.

---

### Migration Notes
- No Electron/event-specific logic: You provide the data stream (e.g., from fetch, websocket, etc.).
- Fully generic: Use any tags/blocks you want.
- Modular: All hooks in `hooks/`, core logic in `core/`.

--- 