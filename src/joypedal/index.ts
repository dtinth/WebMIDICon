import { useEffect, useRef } from 'react'
import { MIDI, createFeature, useConfiguration } from '../core'

export default createFeature({
  name: 'joypedal',
  category: 'addons',
  description:
    'Press button 10 or 11 on any connected gamepad to activate the pedal. These buttons correspond to the analog buttons on a DualShock controller.',
  configuration: {
    title: 'Joypedal',
    properties: {
      'joypedal.buttons': {
        type: 'string',
        default: '10,11',
        markdownDescription:
          'Comma-separated list of gamepad button numbers to be detected. The pedal will be considered “pressed” when _any_ of these buttons are pressed. Use [gamepad-tester.com](https://gamepad-tester.com/) to find out the button.',
      },
      'joypedal.mode': {
        type: 'string',
        default: 'sustain',
        markdownDescription:
          'Whether to use Joypedal as a sustain pedal or as a kick drum.',
        enum: ['sustain', 'kick'],
      },
      'joypedal.kick.midiChannelOverride': {
        type: 'string',
        default: '10',
        markdownDescription:
          'Override the MIDI channel used for the kick drum.',
      },
    },
  },
  serviceComponent: JoypedalService,
})

type Mode = 'sustain' | 'kick'

function JoypedalService() {
  const mainChannel = useConfiguration<string>('midi.output.channel')
  const buttons = useConfiguration<string>('joypedal.buttons')
  const mode = useConfiguration<Mode>('joypedal.mode')
  const kickChannel = useConfiguration<string>(
    'joypedal.kick.midiChannelOverride'
  )

  const config = { buttons, mode, kickChannel, mainChannel }
  const configRef = useRef(config)
  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    return startJoypedal({
      getButtons: () =>
        configRef.current.buttons.value.split(',').map((x) => +x),
      getMainChannel: () => +configRef.current.mainChannel.value,
      getKickChannel: () => +configRef.current.kickChannel.value,
      getMode: () => configRef.current.mode.value,
    })
  }, [])
  return null
}

function startJoypedal(config: {
  getButtons: () => number[]
  getMainChannel: () => number
  getKickChannel: () => number
  getMode: () => Mode
}) {
  let wasDown: { up: () => void } | null = null
  function updateGamepads() {
    let down = false
    for (const gamepad of navigator.getGamepads()) {
      if (!gamepad) continue
      for (const i of config.getButtons()) {
        if (gamepad.buttons[i] && gamepad.buttons[i].pressed) {
          down = true
        }
      }
    }
    if (!wasDown && down) {
      switch (config.getMode()) {
        case 'kick': {
          const channel = config.getKickChannel() || 10
          MIDI.send([0x90 + channel - 1, 36, 127])
          MIDI.send([0x80 + channel - 1, 36, 127])
          wasDown = { up: () => {} }
          break
        }
        case 'sustain': {
          const channel = config.getMainChannel() || 1
          MIDI.send([0xb0 + channel - 1, 0x40, 127])
          wasDown = {
            up: () => {
              MIDI.send([0xb0 + channel - 1, 0x40, 0])
            },
          }
          break
        }
        default:
          console.warn('Joypedal: Invalid mode.')
      }
    } else if (wasDown && !down) {
      try {
        wasDown.up()
      } finally {
        wasDown = null
      }
    }
  }

  const id = setInterval(updateGamepads, 16)
  return () => {
    clearInterval(id)
  }
}
