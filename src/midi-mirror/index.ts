import { createFeature } from '../core'
import { MidiMirror } from './MidiMirror'

export default createFeature({
  name: 'midi-mirror',
  category: 'instruments',
  description: 'Use another MIDI controller as an input, applying channel modifications and transposition.',
  instruments: [
    {
      id: 'mirror',
      sortKey: '501_mirror',
      name: 'MIDI Mirror',
      description:
        'Use another MIDI controller as an input, applying channel modifications and transposition.',
      component: MidiMirror as any,
    },
  ],
})
