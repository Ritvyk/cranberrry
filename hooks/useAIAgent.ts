'use client'
import { useCBSelector } from './useAgentSelector';
import { type CBAgent } from '../types';

export function useCBAgent() {
  const agents = useCBSelector(state => state.agents);
  const getAgentById = (id: string): CBAgent | undefined =>
    agents.find(agent => agent.id === id);

  return { agents, getAgentById };
} 