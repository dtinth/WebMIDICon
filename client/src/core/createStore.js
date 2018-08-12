'use strict'

import { action, observable } from 'mobx'

const transposeKeys = [
  27,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  120,
  121,
  122,
  123,
]
const firstRow = [
  16,
  90,
  83,
  88,
  68,
  67,
  86,
  71,
  66,
  72,
  78,
  74,
  77,
  188,
  76,
  190,
  186,
  191,
]
const secondRow = [
  192,
  9,
  81,
  50,
  87,
  51,
  69,
  82,
  53,
  84,
  54,
  89,
  55,
  85,
  73,
  57,
  79,
  48,
  80,
  219,
  187,
  221,
  8,
  220,
  45,
  46,
  35,
]

export function createStore() {
  const store = observable({
    touches: [],
    keyCodes: observable.map({}),
    transpose: 0,
    octave: 3,
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
    handleKeyDown: action('handleKeyDown', keyCode => {
      {
        const index = transposeKeys.indexOf(keyCode)
        if (index > -1) {
          store.setTranspose(index - 6)
          return
        }
      }
      if (keyCode === 37) {
        store.setTranspose(store.transpose - 1)
        return
      }
      if (keyCode === 38) {
        store.setOctave(store.octave + 1)
        return
      }
      if (keyCode === 39) {
        store.setTranspose(store.transpose + 1)
        return
      }
      if (keyCode === 40) {
        store.setOctave(store.octave - 1)
        return
      }
      store.keyCodes.set(keyCode, true)
    }),
    handleKeyUp: action('handleKeyUp', keyCode => {
      store.keyCodes.delete(keyCode)
    }),
    get activeNotes() {
      const set = new Set()
      for (const key of store.touches) {
        set.add(key)
      }
      for (const keyCode of store.keyCodes.keys()) {
        {
          const index = firstRow.indexOf(+keyCode)
          if (index > -1) {
            set.add(index + 11)
          }
        }
        {
          const index = secondRow.indexOf(+keyCode)
          if (index > -1) {
            set.add(index + 22)
          }
        }
      }
      return set
    },
  })
  return store
}

export default createStore
