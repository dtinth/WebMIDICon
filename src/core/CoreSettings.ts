import { ConfigurationSection } from '../configuration'

export const coreSettings: Record<string, ConfigurationSection> = {
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
