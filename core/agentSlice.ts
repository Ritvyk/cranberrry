import {
  type CBState,
  type CBAction,
  type CBAgent,
  type CBTask,
  type CBMessageBlock,
} from '../types';

const initialState: CBState = {
  agents: [],
  tasks: [],
};

export function CBAgentReducer(
  state: CBState = initialState,
  action: CBAction
): CBState {
  switch (action.type) {
    case 'ADD_AGENT':
      return {
        ...state,
        agents: [...state.agents, action.payload],
      };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map((agent) =>
          agent.id === action.payload.id
            ? { ...agent, ...action.payload }
            : agent
        ),
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload }
            : task
        ),
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };
    case 'ADD_MESSAGE_BLOCK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, messageBlocks: [...(task.messageBlocks || []), action.payload.block] }
            : task
        ),
      };
    default:
      return state;
  }
}

// Action creators (for internal use)
export const addAgent = (agent: CBAgent): CBAction => ({
  type: 'ADD_AGENT',
  payload: agent,
});

export const updateAgent = (
  agent: Partial<CBAgent> & { id: string }
): CBAction => ({
  type: 'UPDATE_AGENT',
  payload: agent,
});

export const addTask = (task: CBTask): CBAction => ({
  type: 'ADD_TASK',
  payload: task,
});

export const updateTask = (
  task: Partial<CBTask> & { id: string }
): CBAction => ({
  type: 'UPDATE_TASK',
  payload: task,
});

export const removeTask = (id: string): CBAction => ({
  type: 'REMOVE_TASK',
  payload: { id },
});

export const addMessageBlock = (taskId: string, block: CBMessageBlock): CBAction => ({
  type: 'ADD_MESSAGE_BLOCK',
  payload: { taskId, block },
});

// Utility to get tasks for a specific agent
export const getTasksForAgent = (
  state: CBState,
  agentId: string
): CBTask[] => {
  return state.tasks.filter((task) => task.agentId === agentId);
}; 