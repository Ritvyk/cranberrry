'use client'
import type { CBTaskStatus } from "../types";
import type { CBTagConfig, CBMessageBlock } from "../types";
import {nanoid} from "nanoid"
import type { Emitter } from "mitt";
import mitt from "mitt";

// Use the same global emitter as CranberrryRenderer
const globalEmitter: Emitter<any> = (typeof window !== 'undefined' ? ((window as any).__cranberrryEmitter || ((window as any).__cranberrryEmitter = mitt())) : mitt());

export type CBBlockSupervisorCallbacks = {
  onBlockFound?: (tag: string) => void;
  onBlockProcessed?: (block: CBMessageBlock) => void;
  onComplete?: () => void;
  onError?: (err: string) => void;
};

export function createAgentSupervisor({
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
  let status: CBTaskStatus = "idle";
  let buffer = "";
  let openTagPositions: { tag: string; index: number }[] = [];

  function getStatus() {
    return status;
  }

  function startTask() {
    status = "ongoing";
    buffer = "";
    openTagPositions = [];
    // No-op: tagConfigs are static for this supervisor
  }

  function parseChunk(chunk: string) {
    if (status !== "ongoing") return;
    buffer += chunk;

    let foundBlock = false;
    for (const tagConfig of tagConfigs) {
      const { tag, processor, component } = tagConfig;
      const openingTagRegex = new RegExp(`<${tag}>`, "g");
      let match: RegExpExecArray | null;
      while ((match = openingTagRegex.exec(buffer)) !== null) {
        if (!openTagPositions.some(t => t.tag === tag && t.index === match!.index)) {
          openTagPositions.push({ tag, index: match.index });
          callbacks.onBlockFound?.(tag);
        }
      }
      // Process complete blocks
      const blockRegex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, "g");
      while ((match = blockRegex.exec(buffer)) !== null) {
        let rawContent = match[1];
        let content: any = rawContent;
        if (processor === 'JSON') {
          try {
            content = JSON.parse(rawContent);
          } catch {
            content = rawContent;
          }
        }
        // Compose message block
        const block: CBMessageBlock = {
          id: nanoid(),
          tag,
          content,
          createdAt: Date.now(),
          component,
          meta: { taskId },
        };
        callbacks.onBlockProcessed?.(block);
  
        emitter.emit('message', { taskId, block });
        buffer = buffer.slice(0, match.index) + buffer.slice(match.index + match[0].length);
        openTagPositions = openTagPositions.filter(t => !(t.tag === tag && t.index === match!.index));
        blockRegex.lastIndex = 0;
        foundBlock = true;
      }
    }
    // If a block was processed, recursively process the buffer for more blocks
    if (foundBlock) {
      parseChunk("");
    } else if (chunk === "" && buffer === "" && status === "ongoing") {
      status = "completed";
      callbacks.onComplete?.();
    }
  }

  function complete() {
    status = "completed";
    callbacks.onComplete?.();
  }

  function error(err: string) {
    status = "failed";
    callbacks.onError?.(err);
    
  }

  function reset() {
    status = "idle";
    buffer = "";
    openTagPositions = [];
    
  }

  return {
    getStatus,
    startTask,
    parseChunk,
    complete,
    error,
    reset,
  };
} 