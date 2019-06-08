import { BeginnerChordMachine } from './BeginnerChordMachine'
import { createFeature } from '../core'

export default createFeature({
  name: 'beginner-chord-machine',
  category: 'instruments',
  description:
    'A simple instrument that lets you play common chords by tapping on the desired chord button.',
  instruments: [
    {
      id: 'beginner',
      sortKey: '501_beginner',
      name: 'Beginner chord machine',
      description: 'A simple instrument that lets you play common chords.',
      component: BeginnerChordMachine,
    },
  ],
})
