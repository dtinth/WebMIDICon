import { Store, StoreValue } from 'nanostores'
import { useCallback } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

export function useStore<TStore extends Store>(
  store: TStore
): StoreValue<TStore> {
  let subscribe = useCallback((onChange) => store.listen(onChange), [store])
  let get = store.get.bind(store)
  return useSyncExternalStore(subscribe, get, get)
}
