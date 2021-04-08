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
        return undefined
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
        return undefined as any
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
