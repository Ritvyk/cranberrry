'use client'
import { type CBTask, type CBTaskStatus } from "../types";
import type { CBMessageBlock } from "../types";

export function createTask(tasks: CBTask[], agentId: string, input: string, meta?: Record<string, any>): CBTask[] {
  const id = Math.random().toString(36).substr(2, 9);
  const now = Date.now();
  return [
    ...tasks,
    {
      id,
      agentId,
      input,
      status: "ongoing",
      createdAt: now,
      updatedAt: now,
      meta,
    },
  ];
}

export function updateTask(tasks: CBTask[], id: string, updates: Partial<CBTask>): CBTask[] {
  return tasks.map((task) => (task.id === id ? { ...task, ...updates } : task));
}

export function removeTask(tasks: CBTask[], id: string): CBTask[] {
  return tasks.filter((task) => task.id !== id);
}

export function getTask(tasks: CBTask[], id: string): CBTask | undefined {
  return tasks.find((task) => task.id === id);
}

export function setTaskStatus(tasks: CBTask[], id: string, status: CBTaskStatus): CBTask[] {
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
}

export function addMessageBlock(tasks: CBTask[], taskId: string, block: CBMessageBlock): CBTask[] {
  return tasks.map((task) =>
    task.id === taskId
      ? { ...task, messageBlocks: [...(task.messageBlocks || []), block] }
      : task
  );
}

export function getMessageBlocks(tasks: CBTask[], taskId: string): CBMessageBlock[] {
  const task = tasks.find((t) => t.id === taskId);
  return task?.messageBlocks || [];
} 