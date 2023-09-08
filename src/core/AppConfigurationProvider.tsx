import React, { ReactNode, useMemo } from 'react'
import { Feature } from './types'
import {
  ConfigurationProperty,
  ConfigurationSchema,
  ConfigurationSection,
  ConfigurationStorage,
} from '../configuration'
import { coreSettings } from './CoreSettings'
import AppConfigurationContext from './AppConfigurationContext'

import { memoize } from 'lodash-es'
import { atom } from 'nanostores'

const getConfigurationStore = memoize((key: string) => {
  const storageKey = `WebMIDICon_${key}`
  const store = atom<string | undefined>(localStorage[storageKey])
  store.listen((value) => {
    if (value !== undefined) {
      localStorage[storageKey] = value
    } else {
      delete localStorage[storageKey]
    }
  })
  return store
})

export default function AppConfigurationProvider({
  features,
  children,
}: {
  features: Feature[]
  children: ReactNode
}) {
  const storage = useMemo((): ConfigurationStorage => {
    return {
      get(key) {
        return getConfigurationStore(key).get()
      },
      has(key) {
        return getConfigurationStore(key).get() !== undefined
      },
      delete(key) {
        getConfigurationStore(key).set(undefined)
      },
      set(key, value) {
        getConfigurationStore(key).set(value)
      },
      watch(key, callback) {
        const unsubscribe = getConfigurationStore(key).listen(callback)
        return {
          unsubscribe: () => unsubscribe(),
        }
      },
    }
  }, [])

  const schema = useMemo((): ConfigurationSchema => {
    const properties: Record<string, ConfigurationProperty> = {}

    const sections: ConfigurationSection[] = [
      ...Object.values(coreSettings),
      ...features.flatMap((feature) =>
        feature.configuration ? [feature.configuration] : []
      ),
    ]
    for (const section of sections) {
      for (const [key, descriptor] of Object.entries(section.properties)) {
        properties[key] = descriptor
      }
    }

    return {
      getValue(key, stringValue) {
        const found = properties[key]
        if (found.type === 'string') {
          return stringValue ?? found.default
        }
        if (found.type === 'boolean') {
          return stringValue === 'true'
            ? true
            : stringValue === 'false'
            ? false
            : found.default
        }
        return undefined as any
      },
      getDefaultValue(key) {
        const found = properties[key]
        return found?.default as any
      },
      serialize(key, value) {
        const found = properties[key]
        if (found.type === 'string') {
          return value as unknown as string
        }
        if (found.type === 'boolean') {
          return value ? 'true' : 'false'
        }
        return ''
      },
      sections,
    }
  }, [features])

  return (
    <AppConfigurationContext.Provider value={{ schema, storage }}>
      {children}
    </AppConfigurationContext.Provider>
  )
}
