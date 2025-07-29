# Cranberrry: AI Agentic State Management Framework 🤖

Cranberrry is a modern, type-safe, redux-inspired state management library for building robust AI agentic flows in frontend SaaS applications. It is framework-agnostic, React-independent, and designed for extensibility and ease of use.

This guide will help you to integrate cranberrry and run your first agent with just a few lines of code in your React application. Cranberrry is fairly customisable and you can hook it up with any particular UI of your choice whether it's custom UI or shadcn ui library. We give you pre-implemented complex logical skeletons to run your AI Agents in your React application so you can hook up any UI of your choice to it.


## 🚀 Installation

Choose your desired package manager to install cranberrry in your React application:

### 📦 npm
```bash
npm install cranberrry
```

### 🧶 yarn
```bash
yarn add cranberrry
```

### ⚡ pnpm
```bash
pnpm install cranberrry
```

## 🎯 Quick Start

### 1️⃣ Initialize AI Agents

To initialize AI Agents you need to use `CBAgent` interface to start defining your Agents.

```typescript
import type { CBAgent } from "cranberrry"

const orion: CBAgent = {
  id: "orion",
  name: "Orion",
  description: "A helpful assistant that can answer questions and help with tasks",
  face: "https://i.imgur.com/1234567890.png",
  designation: "Assistant",
  introduction: "I am a helpful assistant that can answer questions and help with tasks",
  isActive: true,
  isAvailable: true,
  isBusy: false
}
```

### 2️⃣ Export Your Defined AI Agents

To export your defined AI Agents you need to use `CBAgent[]` interface to start defining your Agents.

```typescript
import type { CBAgent } from "cranberrry"

const agents: CBAgent[] = [orion] // add many more

export default agents;
```

### 3️⃣ Initialize Agents Store

Initialize agents store using `createCBStore` to supply all the AI agents that we have defined previously in `agent.ts` file to our frontend React application.

```typescript
import { createCBStore, CBAgentReducer, type CBState } from "cranberrry";
import agents from "./agents";

const initialState: CBState = {
  agents: agents,
  tasks: [],
}

const agentStore = createCBStore(CBAgentReducer, initialState)  

export default agentStore
```

### 4️⃣ Wrap It Up With Provider

Wrap your `main.tsx` or `app.tsx` or `entry` file with `CranberrryProvider` to supply the `agentStore` to your application.

```typescript
import App from './App.tsx'
import { CranberrryProvider } from 'cranberrry'
import agentStore from './agentStore.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CranberrryProvider store={agentStore}>
      <App />
    </CranberrryProvider>
  </StrictMode>,
)
```

## ✨ Features

- 🔧 **Centralized, type-safe state** for AI agents and their tasks
- 🔄 **Redux-like API**: `createStore`, `dispatch`, `subscribe`, `getState`
- 🤖 **Agent Management**: Easy initialization and management of AI agents
- 📋 **Task Management**: Handle agent tasks with built-in state management

- 🧩 **Modular Architecture**: Extensible and robust design
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions

## 📚 Documentation

Full documentation is available in the [Cranberrry](https://www.cranberrry.com) with:
- 📦 **Installation** (npm, yarn, pnpm)
- 🎮 **Playground** (try out agent/task management)
- 📖 **API Reference** (types, store, hooks)
- ⚡ **Features** (agent/task management, hooks, supervisor, etc.)

## 🎮 Playground

Try the playground in the documentation app to experiment with agents and tasks interactively.

## 🐛 Bug Report

If you encounter any bugs or issues, please report them on our [GitHub Issues](https://github.com/Ritvyk/cranberrry/issues) page.

When reporting a bug, please include:
- A clear description of the issue
- Steps to reproduce the problem
- Expected vs actual behavior
- Version of cranberrry you're using
- Your environment details (Node.js version, React version, etc.)

We appreciate your feedback and contributions to make cranberrry better!


## 📄 License

ISC 
