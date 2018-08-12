import { PianoKeyboard } from './PianoKeyboard'

export default {
  instruments: [
    {
      id: 'piano',
      sortKey: '101_piano',
      name: 'Piano',
      description: 'A piano keyboard.',
      component: PianoKeyboard,
    },
  ],
}
