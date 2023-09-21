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
  appearance: {
    title: 'Appearance',
    properties: {
      'appearance.colorMode': {
        type: 'string',
        default: 'chromatone',
        markdownDescription: 'The color mode to use.',
        enum: ['chromatone', 'classic'],
        markdownEnumDescriptions: [
          'Use the Chromatone system for pitch coloring (see: chromatone.center).',
          'Use the classic pitch coloring where the color red corresponds to the note C.',
        ],
      },
    },
  },
}
