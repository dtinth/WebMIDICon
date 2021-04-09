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
        return localStorage['WebMIDICon_' + key]
      },
      has(key) {
        return localStorage['WebMIDICon_' + key] !== undefined
      },
      delete(key) {
        delete localStorage['WebMIDICon_' + key]
      },
      set(key, value) {
        localStorage['WebMIDICon_' + key] = value
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
          return (value as unknown) as string
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
