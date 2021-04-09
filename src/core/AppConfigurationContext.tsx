import { createContext, useContext } from 'react'
import { ConfigurationSchema, ConfigurationStorage } from '../configuration'

export const AppConfigurationContext = createContext<{
  storage: ConfigurationStorage
  schema: ConfigurationSchema
} | null>(null)

export default AppConfigurationContext

export function useAppConfigurationContext() {
  const context = useContext(AppConfigurationContext)
  if (!context) {
    throw new Error('No context')
  }
  return context
}
