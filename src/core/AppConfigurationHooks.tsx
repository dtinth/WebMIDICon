import { useEffect, useState } from 'react'
import { getConfiguration, setConfiguration } from '../configuration'
import { useAppConfigurationContext } from './AppConfigurationContext'

export function useConfiguration<T = unknown>(propertyName: string) {
  const { schema, storage } = useAppConfigurationContext()
  const [value, setStateValue] = useState<T>(() =>
    getConfiguration(schema, storage, propertyName)
  )
  const [overridden, setOverridden] = useState(() => storage.has(propertyName))
  const setValue = (value: T) => {
    setConfiguration<T>(schema, storage, propertyName, value)
  }
  const resetValue = () => {
    storage.delete(propertyName)
  }
  useEffect(() => {
    const subscriber = storage.watch(propertyName, () => {
      setStateValue(getConfiguration(schema, storage, propertyName))
      setOverridden(storage.has(propertyName))
    })
    return () => subscriber.unsubscribe()
  }, [propertyName, storage])
  return { value, overridden, setValue, resetValue }
}
