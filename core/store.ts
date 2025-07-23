import { type CBListener, type CBStore } from '../types';
import { type CBState, type CBAction } from '../types';

export function createCBStore(
  reducer: (state: CBState, action: CBAction) => CBState,
  preloadedState: CBState
): CBStore {
  let state = preloadedState;
  let listeners: CBListener[] = [];

  function getState() {
    return state;
  }

  function dispatch(action: CBAction) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: CBListener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
} 