import { useCranberrryStore } from '../provider/CranberrryProvider';

export function useCBDispatch() {
  return useCranberrryStore().dispatch;
} 