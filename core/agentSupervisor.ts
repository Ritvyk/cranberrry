import type { CBTaskStatus } from "../types";

export type CBBlockSupervisorCallbacks = {
  onBlockFound?: (tag: string) => void;
  onBlockProcessed?: (tag: string, content: any) => void;
  onComplete?: () => void;
  onError?: (err: string) => void;
};

export function createAgentSupervisor({
  callbacks,
}: {
  callbacks: CBBlockSupervisorCallbacks;
}) {
  let status: CBTaskStatus = "idle";
  let buffer = "";
  let tags: string[] = [];
  // Track open tag positions for robust streaming
  let openTagPositions: { tag: string; index: number }[] = [];

  // Custom content parsers for certain tags (e.g., JSON for content-block)
  const contentParsers: Record<string, (raw: string) => any> = {
    "content-block": (raw) => {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    },
  };

  function getStatus() {
    return status;
  }

  function startTask({ tags: taskTags }: { tags: string[] }) {
    status = "ongoing";
    buffer = "";
    tags = taskTags;
    openTagPositions = [];
    console.log("[AgentSupervisor] startTask: tags=", tags);
  }

  function parseChunk(chunk: string) {
    if (status !== "ongoing") return;
    buffer += chunk;
   
    let foundBlock = false;
    // For each tag, scan for opening tags and track their positions
    for (const tag of tags) {
      const openingTagRegex = new RegExp(`<${tag}>`, "g");
      let match: RegExpExecArray | null;
      while ((match = openingTagRegex.exec(buffer)) !== null) {
        // Only track if not already tracked at this position
        if (!openTagPositions.some(t => t.tag === tag && t.index === match!.index)) {
          openTagPositions.push({ tag, index: match.index });
          callbacks.onBlockFound?.(tag);
         
        }
      }
    }
    // For each tag, process complete blocks
    for (const tag of tags) {
       
      const blockRegex = new RegExp(`<${tag}>([\s\S]*?)<\/${tag}>`, "g");
     
      let match: RegExpExecArray | null;
      while ((match = blockRegex.exec(buffer)) !== null) {
        let content = match[1];
        if (contentParsers[tag]) {
          try {
            content = contentParsers[tag](content);
          } catch {}
        }
        callbacks.onBlockProcessed?.(tag, content);
       
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
    tags = [];
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