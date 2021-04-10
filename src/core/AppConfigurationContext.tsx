import { createContext, useContext } from 'react'
import { ConfigurationSchema, ConfigurationStorage } from '../configuration'

type AppConfiguration = {
  storage: ConfigurationStorage
  schema: ConfigurationSchema
}

export const AppConfigurationContext = createContext<AppConfiguration | null>(
  null
)

export default AppConfigurationContext

export function useAppConfigurationContext() {
  const context = useContext(AppConfigurationContext)
  if (!context) {
    throw new Error('No context')
  }
  return context
}
