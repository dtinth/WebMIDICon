import { MIDI, createFeature } from '../core'

let wasDown = false
function updateGamepads() {
  let down = false
  for (const gamepad of navigator.getGamepads()) {
    if (!gamepad) continue
    for (const i of [10, 11]) {
      if (gamepad.buttons[i] && gamepad.buttons[i].pressed) {
        down = true
      }
    }
  }
  if (!wasDown && down) {
    wasDown = true
    // MIDI.send([0x99, 36, 127])
    // MIDI.send([0x89, 36, 127])
    MIDI.send([0xb0, 0x40, 127])
  } else if (wasDown && !down) {
    wasDown = false
    MIDI.send([0xb0, 0x40, 0])
  }
}

setInterval(updateGamepads, 16)

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
})
