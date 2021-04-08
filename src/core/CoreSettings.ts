import { FeatureConfiguration } from '../configuration'

export const coreSettings: Record<string, FeatureConfiguration> = {
  midi: {
    title: 'MIDI',
    properties: {
      'midi.output.channel': {
        type: 'string',
        default: '1',
        markdownDescription: 'The MIDI output channel to use.',
      },
    },
  },
}
