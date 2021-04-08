export function getConfiguration<T>(
  schema: ConfigurationSchema,
  storage: ConfigurationStorage,
  key: string
) {
  return schema.getValue<T>(key, storage.get(key))
}

/**
 * Provides a list of valid settings, what types each setting property is allowed,
 * and the default value.
 */
export interface ConfigurationSchema {
  getValue<T>(key: string, stringValue: string | undefined): T
}

/**
 * Provides storage for settings. Everything stored as string.
 */
export interface ConfigurationStorage {
  get(key: string): string | undefined
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
