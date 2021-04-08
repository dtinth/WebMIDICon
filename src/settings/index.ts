export function get<T>(
  schema: SettingsSchema,
  storage: SettingsStorage,
  key: string
) {
  return schema.getValue<T>(key, storage.get(key))
}

/**
 * Provides a list of valid settings, what types each setting property is allowed,
 * and the default value.
 */
export interface SettingsSchema {
  getValue<T>(key: string, stringValue: string | undefined): T
}

/**
 * Provides storage for settings. Everything stored as string.
 */
export interface SettingsStorage {
  get(key: string): string | undefined
}
