'use client'
import { useState, useCallback, useRef, useEffect } from "react";
import { useCBTaskSupervisor } from "./useAgentSupervisor";
import { useCBTaskManager } from "./useAgentTaskManager";
import { useCBDispatch } from "./useAgentDispatch";
import { updateAgent } from "../core/agentSlice";
import type { CBBlockSupervisorCallbacks } from "../core/agentSupervisor";
import type { CBTagConfig, CBMessageBlock } from "../types";
import mitt from "mitt";
import type { Emitter } from "mitt";

// Use the same global emitter as CranberrryRenderer
const globalEmitter: Emitter<any> = (typeof window !== 'undefined' ? ((window as any).__cranberrryEmitter || ((window as any).__cranberrryEmitter = mitt())) : mitt());

export function useCBController({
  agentId,
  tagConfigs,
  callbacks,
}: {
  agentId: string;
  tagConfigs: CBTagConfig[];
  callbacks: CBBlockSupervisorCallbacks;
}) {
  const [prompt, setPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const currentTaskIdRef = useRef<string | null>(null);
  const dispatch = useCBDispatch();
  const emitter = globalEmitter;

  const {
    tasks,
    createTask,
    updateTask,
    removeTask,
    getTask,
    setTaskStatus,
    addMessageBlockToTask,
    // addMessageBlock, getMessageBlocks imported above
  } = useCBTaskManager();

  // Always keep the ref in sync with state
  currentTaskIdRef.current = currentTaskId;

  // Wrap onComplete and onError to update agent status and task status robustly
  const wrappedCallbacks = {
    ...callbacks,
    onComplete: () => {
     

      if(currentTaskIdRef.current) {
        updateTask(currentTaskIdRef.current, { status: 'completed', updatedAt: Date.now() })
      }
      dispatch(updateAgent({ id: agentId, isBusy: false }));
      callbacks.onComplete?.();
    },
    onError: (err: string) => {
      if(currentTaskIdRef.current) {
        updateTask(currentTaskIdRef.current, { status: 'failed', updatedAt: Date.now() })
      }
      dispatch(updateAgent({ id: agentId, isBusy: false }));
      callbacks.onError?.(err);
    },
  };

  // Internal message management
  const [messageBlocks, setMessageBlocks] = useState<CBMessageBlock[]>([]);

  // Keep messageBlocks in sync with the store for the current task
  // This ensures that if the store updates (e.g., from another tab or event), we always show the latest
  useEffect(() => {
    if (currentTaskId) {
      setMessageBlocks(getTask(currentTaskId)?.messageBlocks || []);
    } else {
      setMessageBlocks([]);
    }
  }, [currentTaskId, tasks]);

  const supervisor = useCBTaskSupervisor({
    callbacks: {
      ...wrappedCallbacks,
      onBlockProcessed: (block: CBMessageBlock) => {
        if (currentTaskIdRef.current) {
          addMessageBlockToTask(currentTaskIdRef.current, block);
        }
        callbacks.onBlockProcessed?.(block);
      },
    },
    tagConfigs,
    emitter,
  });
  const { status, startTask, parseChunk, complete, error: supervisorError, errorCallback, reset } = supervisor;

  const isRunning = status === "ongoing";

  const startAgentTask = useCallback(
    (newPrompt: string, newMeta?: Record<string, any>) => {
      if (!newPrompt) throw new Error('Prompt is required');
      setPrompt(newPrompt);
     
      setErrorMessage(null);
      const newTaskId = createTask(agentId, newPrompt, newMeta);
     
      setCurrentTaskId(newTaskId);
      currentTaskIdRef.current = newTaskId;
      dispatch(updateAgent({ id: agentId, isBusy: true }));
      // messageBlocks will be reset by useEffect when currentTaskId changes
      startTask(newTaskId);
      return newTaskId;
    },
    [startTask, createTask, tagConfigs, agentId, dispatch]
  );

  const startExistingAgentTask = useCallback(
    (taskId: string) => {
      const existingTask = getTask(taskId);
      
      if (!existingTask) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      if (existingTask.agentId !== agentId) {
        throw new Error(`Task ${taskId} does not belong to agent ${agentId}`);
      }

      // Check if task is in a valid state to resume
      if (existingTask.status === 'completed') {
        throw new Error(`Task ${taskId} is already completed and cannot be resumed`);
      }

      if (existingTask.status === 'failed') {
        // Reset failed task to ongoing status
        updateTask(taskId, { status: 'ongoing', updatedAt: Date.now() });
      }

      setPrompt(existingTask.input);
      setErrorMessage(null);
      setCurrentTaskId(taskId);
      currentTaskIdRef.current = taskId;
      dispatch(updateAgent({ id: agentId, isBusy: true }));
      
      // Start the task in the supervisor
      startTask(taskId);
      
      return taskId;
    },
    [getTask, agentId, updateTask, startTask, dispatch]
  );

  // Expose the error function for simulation
  const completeWithError = useCallback((err: string) => {
    setErrorMessage(err);
    callbacks.onError?.(err);
    errorCallback(err);
  }, [callbacks, errorCallback]);

  return {
    prompt,
    setPrompt,
    isRunning,
    error: errorMessage || supervisorError,
    startAgentTask,
    startExistingAgentTask,
    parseChunk,
    complete,
    reset,
    status,
    tasks,
    updateTask,
    removeTask,
    getTask,
    setTaskStatus,
    completeWithError,
    messageBlocks,
    emitter,
  };
} 