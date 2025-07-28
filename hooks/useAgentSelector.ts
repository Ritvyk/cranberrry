'use client'
import { useEffect, useRef, useState } from 'react';
import { useCranberrryStore } from '../provider/CranberrryProvider';
import { type CBState } from '../types';

export function useCBSelector<T>(selector: (state: CBState) => T): T {
  const store = useCranberrryStore();
  const [selected, setSelected] = useState(() => selector(store.getState()));
  const latestSelected = useRef(selected);

  useEffect(() => {
    function checkForUpdates() {
      const newSelected = selector(store.getState());
      if (newSelected !== latestSelected.current) {
        latestSelected.current = newSelected;
        setSelected(newSelected);
      }
    }
    const unsubscribe = store.subscribe(checkForUpdates);
    return unsubscribe;
  }, [store, selector]);

  return selected;
}

export const useAgentSelector = useCBSelector; 