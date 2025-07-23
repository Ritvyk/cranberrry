import { useRef, useState, useCallback } from "react";
import { createAgentSupervisor, type CBBlockSupervisorCallbacks } from "../core/agentSupervisor";
import type { CBTaskStatus } from "../types";

export function useCBTaskSupervisor({
  callbacks,
}: {
  callbacks: CBBlockSupervisorCallbacks;
}) {
  const supervisorRef = useRef<ReturnType<typeof createAgentSupervisor> | null>(null);
  const [status, setStatus] = useState<CBTaskStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  if (!supervisorRef.current) {
    supervisorRef.current = createAgentSupervisor({ callbacks });
  }

  const startTask = useCallback((tags: string[]) => {
    supervisorRef.current?.startTask({ tags });
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