import { PianoKeyboard } from './PianoKeyboard'
import { createFeature } from '../core'

export default createFeature({
  name: 'piano-keyboard',
  category: 'instruments',
  description: 'A touchscreen piano keyboard.',
  instruments: [
    {
      id: 'piano',
      sortKey: '101_piano',
      name: 'Piano',
      description: 'A piano keyboard.',
      component: PianoKeyboard as any,
    },
  ],
})
