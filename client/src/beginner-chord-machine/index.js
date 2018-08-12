import { BeginnerChordMachine } from './BeginnerChordMachine'

export default {
  instruments: [
    {
      id: 'beginner',
      sortKey: '501_beginner',
      name: 'Beginner chord machine',
      description: 'A simple instrument that lets you play common chords.',
      component: BeginnerChordMachine,
    },
  ],
}
