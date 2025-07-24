import React, { useEffect, useState } from 'react';
import { useAgentSelector } from '../hooks/useAgentSelector';
import type { CBMessageBlock } from '../types';
import mitt from 'mitt';
import type { Emitter } from 'mitt';

// Use the same global emitter as everywhere else
const globalEmitter: Emitter<any> = (typeof window !== 'undefined' ? ((window as any).__cranberrryEmitter || ((window as any).__cranberrryEmitter = mitt())) : mitt());

export interface CranberrryRendererProps {
  taskId: string;
}

export const CranberrryRenderer: React.FC<CranberrryRendererProps> = ({ taskId }) => {
  // Get message blocks from the store (if available)
  const messageBlocks = useAgentSelector(
    (state: any) => (state.tasks.find((t: any) => t.id === taskId)?.messageBlocks || [])
  );
  const [liveBlocks, setLiveBlocks] = useState<CBMessageBlock[]>(messageBlocks);

  useEffect(() => {
    setLiveBlocks(messageBlocks);
  }, [messageBlocks]);

  useEffect(() => {
    function onMessage({ taskId: incomingTaskId, block }: { taskId: string; block: CBMessageBlock }) {
     
      if (incomingTaskId === taskId) {
        setLiveBlocks((prev) => [...prev, block]);
      }
    }
    globalEmitter.on('message', onMessage);
    return () => {
      globalEmitter.off('message', onMessage);
    };
  }, [taskId]);

  return (
    <div className="cranberrry-renderer-messages space-y-2">
      {liveBlocks.map((block) => {
        const BlockComponent = block.component;
        return <BlockComponent key={block.id} ai={block.content} />;
      })}
    </div>
  );
}; 