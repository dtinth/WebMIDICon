import { createContext } from 'react'
import { ConfigurationSchema, ConfigurationStorage } from '../configuration'

export default createContext<{
  storage: ConfigurationStorage
  schema: ConfigurationSchema
} | null>(null)
