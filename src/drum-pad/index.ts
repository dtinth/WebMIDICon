import { createFeature } from '../core'
import { DrumPadContainer } from './DrumPadContainer'

export default createFeature({
  name: 'drum-pad',
  category: 'instruments',
  description:
    'A touchscreen drum pad with variable velocity. Touching nearer the center produces louder hits.',
  instruments: [
    {
      id: 'drums',
      sortKey: '201_drums',
      name: 'Drum pad',
      description:
        'A drum pad with variable velocity. Touching nearer the center produces louder hits.',
      component: DrumPadContainer as any,
    },
  ],
  configuration: {
    title: 'Drum Pad',
    properties: {
      'drumPad.midiChannelOverride': {
        type: 'string',
        default: '10',
        markdownDescription:
          'Overrides the MIDI channel for outputting drum notes.',
      },
    },
  },
})
