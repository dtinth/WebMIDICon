import * as MIDI from './MIDI'
import { Feature } from './types'

export * from './types'

export { App } from './App'
export { MIDI }

export function createFeature(f: Feature) {
  return f
}
