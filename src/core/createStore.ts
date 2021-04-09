import { action, observable, reaction } from 'mobx'
import { Store, Feature, ActiveNote } from './types'
import { KeyboardEvent } from 'react'

export function createStore(features: Feature[]): Store {
  const keyDownHandlers = features.map((f) => f.onKeyDown!).filter((fn) => fn)
  const keyUpHandlers = features.map((f) => f.onKeyUp!).filter((fn) => fn)
  const activeNoteProviders = features
    .map((f) => f.getActiveNotes!)
    .filter((fn) => fn)

  const store: Store = observable({
    touches: [],
    transpose: 0,
    octave: 3,
    noteVelocity: +sessionStorage.WEBMIDICON_VELOCITY || 0x60,
    setTranspose: action('setTranspose', (transpose: number) => {
      let octave = store.octave
      while (transpose > 6) {
        transpose -= 12
        octave += 1
      }
      while (transpose < -6) {
        transpose += 12
        octave -= 1
      }
      store.transpose = transpose
      if (octave !== store.octave) store.setOctave(octave)
    }),
    setOctave: action('setOctave', (octave: number) => {
      store.octave = octave
    }),
    handleTouches: action('updateTouches', (touches: ActiveNote[]) => {
      store.touches = touches
    }),
    handleKeyDown: action('handleKeyDown', (e: KeyboardEvent) => {
      keyDownHandlers.forEach((handler) => handler(store, e))
    }),
    handleKeyUp: action('handleKeyUp', (e: KeyboardEvent) => {
      keyUpHandlers.forEach((handler) => handler(store, e))
    }),
    get activeNotes() {
      const set = new Set<ActiveNote>()
      for (const key of store.touches) {
        set.add(key)
      }
      activeNoteProviders.forEach((provider) => {
        for (const key of provider()) {
          set.add(key)
        }
      })
      return set
    },
  })

  reaction(
    () => store.noteVelocity,
    (velocity) => {
      sessionStorage.WEBMIDICON_VELOCITY = velocity
    }
  )
  return store
}

export default createStore
