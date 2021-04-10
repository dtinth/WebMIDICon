export function getConfiguration<T>(
  schema: ConfigurationSchema,
  storage: ConfigurationStorage,
  key: string
) {
  return schema.getValue<T>(key, storage.get(key))
}

export function setConfiguration<T>(
  schema: ConfigurationSchema,
  storage: ConfigurationStorage,
  key: string,
  value: T
) {
  storage.set(key, schema.serialize(key, value))
}

/**
 * Provides a list of valid settings, what types each setting property is allowed,
 * and the default value.
 */
export interface ConfigurationSchema {
  serialize<T>(key: string, value: T): string
  getValue<T>(key: string, stringValue: string | undefined): T
  getDefaultValue<T>(key: string): T
  sections: ConfigurationSection[]
}

/**
 * Provides storage for settings. Everything stored as string.
 */
export interface ConfigurationStorage {
  get(key: string): string | undefined
  has(key: string): boolean
  set(key: string, value: string): void
  delete(key: string): void
  watch(key: string, onChange: () => void): { unsubscribe: () => void }
}

export interface ConfigurationSection {
  title: string
  properties: Record<string, ConfigurationProperty>
}

export type ConfigurationProperty =
  | ConfigurationPropertyType<'string', string>
  | ConfigurationPropertyType<'boolean', boolean>

export type ConfigurationPropertyType<TypeName, Type> = {
  type: TypeName
  default: Type
  markdownDescription: string
  enum?: Type[]
  markdownEnumDescriptions?: Type[]
}
