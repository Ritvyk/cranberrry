'use client'
import  { type ReactNode, createContext, useContext } from 'react';
import type { CBStore } from '../types';

const CranberrryStoreContext = createContext<CBStore | null>(null);
CranberrryStoreContext.displayName = 'CranberrryStoreContext';

export function CranberrryProvider({
  store,
  children,
}: {
  store: CBStore;
  children: ReactNode;
}) {
  return (
    <CranberrryStoreContext.Provider value={store}>
      {children}
    </CranberrryStoreContext.Provider>
  );
}

export function useCranberrryStore() {
  const store = useContext(CranberrryStoreContext);
  if (!store) {
    throw new Error('useCranberrryStore must be used within a CranberrryProvider');
  }
  return store;
} 