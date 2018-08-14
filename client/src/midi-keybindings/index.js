import { MIDI } from '../core'
import { observable } from 'mobx'

const state = observable({
  keyCodes: observable.map({}),
})

export default {
  onKeyDown(store, { keyCode }) {
    {
      const index = transposeKeys.indexOf(keyCode)
      if (index > -1) {
        store.setTranspose(index - 6)
        return
      }
    }
    if (keyCode === 32) {
      MIDI.send([0xb0, 0x40, 127])
      return
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
    state.keyCodes.set(keyCode, true)
  },
  onKeyUp(store, { keyCode }) {
    if (keyCode === 32) {
      MIDI.send([0xb0, 0x40, 0])
      return
    }
    state.keyCodes.delete(keyCode)
  },
  getActiveNotes() {
    const notes = []
    for (const keyCode of state.keyCodes.keys()) {
      {
        const index = firstRow.indexOf(+keyCode)
        if (index > -1) notes.push(index + 11)
      }
      {
        const index = secondRow.indexOf(+keyCode)
        if (index > -1) notes.push(index + 22)
      }
    }
    return notes
  },
}

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
