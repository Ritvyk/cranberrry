// Cranberrry Agentic Framework Types (CB Unified)

export type CBListener = () => void;

export interface CBStore {
  getState: () => CBState;
  dispatch: (action: CBAction) => void;
  subscribe: (listener: CBListener) => () => void;
}

export type CBAgentID = string;

export interface CBAgent {
  id: CBAgentID;
  name: string;
  face?: string;
  designation?: string;
  description?: string;
  introduction?: string;
  isActive: boolean;
  isAvailable: boolean;
  isBusy: boolean;
}

export type CBTaskStatus = 'idle' | 'ongoing' | 'completed' | 'failed'  ;
// 'pending' and 'in_progress' are aliases for legacy compatibility, but only use 'idle', 'ongoing', 'completed', 'failed' in new code.

export type CBBlockProcessor = 'TEXT' | 'JSON';

export interface CBTagConfig {
  tag: string;
  processor: CBBlockProcessor;
  component: React.ComponentType<{ ai: any }>;
}

export interface CBMessageBlock {
  id: string; // unique per block
  tag: string;
  content: any; // processed content (string or object)
  createdAt: number;
  component: React.ComponentType<{ ai: any }>;
  meta?: Record<string, any>;
}

export interface CBTask {
  id: string;
  agentId: CBAgentID;
  input: string;
  status: CBTaskStatus;
  createdAt: number;
  updatedAt: number;
  meta?: Record<string, any>;
  response?: string;
  messageBlocks?: CBMessageBlock[]; // new: processed message blocks for this task
}

export interface CBState {
  agents: CBAgent[];
  tasks: CBTask[];
  // Optionally, a map of taskId to message blocks for fast lookup
  // messagesByTaskId?: Record<string, CBMessageBlock[]>;
}

export type CBAction =
  | { type: 'ADD_AGENT'; payload: CBAgent }
  | { type: 'UPDATE_AGENT'; payload: Partial<CBAgent> & { id: CBAgentID } }
  | { type: 'ADD_TASK'; payload: CBTask }
  | { type: 'UPDATE_TASK'; payload: Partial<CBTask> & { id: string } }
  | { type: 'REMOVE_TASK'; payload: { id: string } }
  | { type: 'ADD_MESSAGE_BLOCK'; payload: { taskId: string; block: CBMessageBlock } };

export type CBBlockCallback<T = any> = (block: T) => void;

export type CBTaskCallbacks = {
  [blockTag: string]: CBBlockCallback<any>;
} & {
  onComplete?: () => void;
  onError?: (error: string) => void;
};

export type CBStartTaskParams = {
  agentId: CBAgentID;
  input: string;
  callbacks: CBTaskCallbacks;
  meta?: Record<string, any>;
}; 