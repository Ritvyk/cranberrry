import { useState, useCallback, useRef } from "react";
import { useCBTaskSupervisor } from "./useAgentSupervisor";
import { useCBTaskManager } from "./useAgentTaskManager";
import { useCBDispatch } from "./useAgentDispatch";
import { updateAgent } from "../core/agentSlice";
import type { CBBlockSupervisorCallbacks } from "../core/agentSupervisor";

export function useCBController({
  agentId,
  tags,
  callbacks,
}: {
  agentId: string;
  tags: string[];
  callbacks: CBBlockSupervisorCallbacks;
}) {
  const [prompt, setPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const currentTaskIdRef = useRef<string | null>(null);
  const dispatch = useCBDispatch();

  const {
    tasks,
    createTask,
    updateTask,
    removeTask,
    getTask,
    setTaskStatus,
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

  const {
    status,
    startTask,
    parseChunk,
    complete,
    error: supervisorError,
    errorCallback,
    reset,
  } = useCBTaskSupervisor({ callbacks: wrappedCallbacks });

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
      startTask(tags);
    },
    [startTask, createTask, tags, agentId, dispatch]
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
  };
} 