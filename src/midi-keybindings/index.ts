import { MIDI, Store, createFeature, useConfiguration } from '../core'
import { observable } from 'mobx'
import { KeyboardEvent, useEffect } from 'react'
import { showInformationMessage } from '../core/showInformationMessage'

const state = observable({
  keyCodes: observable.map<number, { altKey: boolean }>({}),
})

function getKeyCode(event: KeyboardEvent) {
  // macOS does not support the PC "Insert" key.
  // You can use Karabiner to remap "Insert" key into "PrintScreen" key.
  if (event.keyCode === 124) {
    return 45
  }

  // Add 1000 to keyCode if on the right side.
  // This allows us to distinguish RShift from LShift.
  return (
    (event.location === 2 ? 1000 : event.location === 3 ? 2000 : 0) +
    event.keyCode
  )
}

let pedalMidiChannel = 1
let chromaticMode = false
let currentPedal: { up: () => void } | null = null

const drumMap: Record<string, number> = {
  // ZXCV
  90: 36,
  88: 38,
  67: 37,
  86: 36,

  // ASDFGH
  65: 36,
  83: 40,
  68: 42,
  70: 46,
  71: 44,

  // QWERT
  81: 50,
  87: 47,
  69: 45,
  82: 43,

  // 1234
  49: 49,
  50: 52,
  51: 55,
  52: 57,
}

function notifyTranspose(store: Store) {
  showInformationMessage(
    `Octave: ${store.octave}, Transpose: ${store.transpose}`
  )
}

export default createFeature({
  name: 'midi-keybindings',
  category: 'addons',
  description:
    'Play notes with your QWERTY keyboard. Supports 3 octaves. ' +
    'Use Left/Right to transpose, Up/Down to change octave, Space to hold the pedal, and Esc-F12 to set a key.',
  onKeyDown(store, event) {
    const keyCode = getKeyCode(event)
    {
      const index = transposeKeys.indexOf(keyCode)
      if (index > -1) {
        store.setTranspose(index - 6)
        return
      }
    }
    if (keyCode === 32) {
      const channel = pedalMidiChannel
      MIDI.send([0xb0 + channel - 1, 0x40, 127])
      currentPedal = {
        up: () => {
          MIDI.send([0xb0 + channel - 1, 0x40, 0])
        },
      }
      return
    }
    if (keyCode === 37) {
      store.setTranspose(store.transpose - 1)
      notifyTranspose(store)
      return
    }
    if (keyCode === 38) {
      store.setOctave(store.octave + 1)
      notifyTranspose(store)
      return
    }
    if (keyCode === 39) {
      store.setTranspose(store.transpose + 1)
      notifyTranspose(store)
      return
    }
    if (keyCode === 40) {
      store.setOctave(store.octave - 1)
      notifyTranspose(store)
      return
    }

    const drumMode = false // true // false
    if (drumMode) {
      const found = drumMap[keyCode]
      if (found) {
        const channel = pedalMidiChannel
        const note = found
        MIDI.send([0x90 + channel - 1, note, store.noteVelocity])
        MIDI.send([0x80 + channel - 1, note, store.noteVelocity])
      }
      return
    }

    state.keyCodes.set(keyCode, { altKey: event.altKey })
  },
  onKeyUp(store, event) {
    const keyCode = getKeyCode(event)
    if (keyCode === 32 && currentPedal) {
      currentPedal.up()
      currentPedal = null
      return
    }
    state.keyCodes.delete(keyCode)
  },
  getActiveNotes() {
    const notes = []
    if (!chromaticMode) {
      for (const [keyCode, { altKey }] of state.keyCodes.entries()) {
        {
          const index = firstRow.indexOf(+keyCode)
          if (index > -1) notes.push(index + 11)
        }
        {
          const index = secondRow.indexOf(+keyCode)
          if (index > -1) notes.push(index + 22 + (altKey ? 12 : 0))
        }
      }
    } else {
      for (const [keyCode] of state.keyCodes.entries()) {
        for (const [row, keys] of chromatic.entries()) {
          const index = keys.indexOf(+keyCode)
          if (index > -1) notes.push(row + index * 3 + 4)
        }
      }
    }
    return notes
  },
  configuration: {
    title: 'MIDI Keybindings',
    properties: {
      'midiKeybindings.keymap': {
        type: 'string',
        default: 'piano',
        markdownDescription:
          'Whether to use the Piano keymap or B-System Chromatic Button Accordian keymap.',
        enum: ['piano', 'bcba'],
      },
    },
  },
  serviceComponent: MidiKeybindingsService,
})

function MidiKeybindingsService() {
  const mainChannel = useConfiguration<string>('midi.output.channel')
  const keymap = useConfiguration<string>('midiKeybindings.keymap')
  useEffect(() => {
    pedalMidiChannel = +mainChannel.value || 1
  }, [mainChannel.value])
  useEffect(() => {
    chromaticMode = keymap.value === 'bcba'
  }, [keymap.value])
  return null
}

const transposeKeys = [
  27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
]

const firstRow = [
  16, 90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 186, 191,
  1016,
]

const secondRow = [
  192, 9, 81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80,
  219, 187, 221, 8, 220, 45, 46, 35, 36, 34, 33, 2055, 2056, 2111, 2057, 2106,
  2107, 2109,
]

const chromatic = [
  [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8],
  [9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220],
  [17, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222],
  [16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 1016],
]
