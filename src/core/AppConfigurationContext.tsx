import { createContext } from 'react'
import { ConfigurationSchema, ConfigurationStorage } from '../configuration'

export const AppConfigurationContext = createContext<{
  storage: ConfigurationStorage
  schema: ConfigurationSchema
} | null>(null)
