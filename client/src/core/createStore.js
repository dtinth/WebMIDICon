'use strict'

import { action, observable } from 'mobx'

export function createStore(features) {
  const keyDownHandlers = features.map(f => f.onKeyDown).filter(fn => fn)
  const keyUpHandlers = features.map(f => f.onKeyUp).filter(fn => fn)
  const activeNoteProviders = features
    .map(f => f.getActiveNotes)
    .filter(fn => fn)
  const store = observable({
    touches: [],
    transpose: 0,
    octave: 3,
    noteVelocity: 0x60,
    setTranspose: action('setTranspose', transpose => {
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
    setOctave: action('setOctave', octave => {
      store.octave = octave
    }),
    handleTouches: action('updateTouches', touches => {
      store.touches = touches
    }),
    handleKeyDown: action('handleKeyDown', e => {
      keyDownHandlers.forEach(handler => handler(store, e))
    }),
    handleKeyUp: action('handleKeyUp', e => {
      keyUpHandlers.forEach(handler => handler(store, e))
    }),
    get activeNotes() {
      const set = new Set()
      for (const key of store.touches) {
        set.add(key)
      }
      activeNoteProviders.forEach(provider => {
        for (const key of provider()) {
          set.add(key)
        }
      })
      return set
    },
  })
  return store
}

export default createStore
