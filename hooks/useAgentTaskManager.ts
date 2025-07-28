'use client'
import { useCallback } from "react";
import { type CBMessageBlock, type CBTask, type CBTaskStatus } from "../types";
import { useCBDispatch } from "./useAgentDispatch";
import { useCBSelector } from "./useAgentSelector";
import {
  addTask as addTaskAction,
  updateTask as updateTaskAction,
  removeTask as removeTaskAction,
  addMessageBlock as addMessageBlockAction,
} from "../core/agentSlice";

export function useCBTaskManager() {
  const dispatch = useCBDispatch();
  const tasks = useCBSelector((state: { tasks: CBTask[] }) => state.tasks);
  const createTask = useCallback((agentId: string, input: string, meta?: Record<string, any>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const now = Date.now();
    dispatch(
      addTaskAction({
        id,
        agentId,
        input,
        status: "ongoing",
        createdAt: now,
        updatedAt: now,
        meta,
      })
    );
    return id;
  }, [dispatch]);

  const updateTask = useCallback((id: string, updates: Partial<CBTask>) => {
    dispatch(updateTaskAction({ id, ...updates }));
  }, [dispatch]);

  const removeTask = useCallback((id: string) => {
    dispatch(removeTaskAction(id));
  }, [dispatch]);

  const getTask = useCallback((id: string) => {
    return tasks.find((task: CBTask) => task.id === id);
  }, [tasks]);

  const setTaskStatus = useCallback((id: string, status: CBTaskStatus) => {
    dispatch(updateTaskAction({ id, status, updatedAt: Date.now() }));
  }, [dispatch]);

  const addMessageBlockToTask = useCallback((taskId: string, block: CBMessageBlock) => {
    dispatch(addMessageBlockAction(taskId, block));
  }, [dispatch]);

  return {
    tasks,
    createTask,
    updateTask,
    removeTask,
    getTask,
    setTaskStatus,
    addMessageBlockToTask,
  };
} 