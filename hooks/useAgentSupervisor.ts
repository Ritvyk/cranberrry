import { useRef, useState, useCallback } from "react";
import { createAgentSupervisor, type CBBlockSupervisorCallbacks } from "../core/agentSupervisor";
import type { CBTaskStatus } from "../types";
import type { CBTagConfig } from "../types";
import type { Emitter } from "mitt";
import mitt from "mitt";

// Use the same global emitter as CranberrryRenderer
const globalEmitter: Emitter<any> = (typeof window !== 'undefined' ? ((window as any).__cranberrryEmitter || ((window as any).__cranberrryEmitter = mitt())) : mitt());

export function useCBTaskSupervisor({
  callbacks,
  tagConfigs,
  emitter = globalEmitter,
  taskId,
}: {
  callbacks: CBBlockSupervisorCallbacks;
  tagConfigs: CBTagConfig[];
  emitter?: Emitter<any>;
  taskId: string;
}) {
  const supervisorRef = useRef<ReturnType<typeof createAgentSupervisor> | null>(null);
  const [status, setStatus] = useState<CBTaskStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  if (!supervisorRef.current) {
    supervisorRef.current = createAgentSupervisor({ callbacks, tagConfigs, emitter, taskId });
  }

  const startTask = useCallback(() => {
    supervisorRef.current?.startTask();
    setStatus("ongoing");
    setError(null);
  }, []);

  const parseChunk = useCallback((chunk: string) => {
    supervisorRef.current?.parseChunk(chunk);
  }, []);

  const complete = useCallback(() => {
    supervisorRef.current?.complete();
    setStatus("completed");
  }, []);

  const errorCallback = useCallback((err: string) => {
    supervisorRef.current?.error(err);
    setStatus("failed");
    setError(err);
  }, []);

  const reset = useCallback(() => {
    supervisorRef.current?.reset();
    setStatus("idle");
    setError(null);
  }, []);

  return {
    status,
    startTask,
    parseChunk,
    complete,
    error: error,
    errorCallback,
    reset,
  };
} 