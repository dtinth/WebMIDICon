import { DrumPad } from './DrumPad'

export default {
  instruments: [
    {
      id: 'drums',
      sortKey: '201_drums',
      name: 'Drum pad',
      description:
        'A velocity-variable drum pad. Touching near the center means more velocity.',
      component: DrumPad,
    },
  ],
}
