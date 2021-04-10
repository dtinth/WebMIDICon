import React, { createContext, ReactNode, useContext, useState } from 'react'
import createStore from './createStore'
import { Feature, Store } from './types'

const AppStoreContext = createContext<Store | null>(null)

export default function AppStoreProvider({
  features,
  children,
}: {
  features: Feature[]
  children: ReactNode
}) {
  const [store] = useState(() => {
    return createStore(features)
  })
  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error('No store provided')
  }
  return store
}
