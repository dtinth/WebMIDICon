import { atom } from 'nanostores'

export const $midiAccess = atom<WebMidi.MIDIAccess | null>(null)

/**
 * Use an old-school method to enumerate the keys of a Map because
 * iOS Web MIDI Browser seems to have implemented a Map that does not
 * fully implement the iterable protocol.
 */
export function enumerateKeys<TMap extends Map<string, any>>(map: TMap) {
  const keys: string[] = []
  const iterator = map.keys()
  for (;;) {
    const { done, value: key } = iterator.next()
    if (done) break
    keys.push(key)
  }
  return keys
}
