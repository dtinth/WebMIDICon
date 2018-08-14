import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'
import * as MIDI from './MIDI'

const main = document.createElement('div')
main.id = 'main'
document.body.appendChild(main)

const featureModules = [
  require('./beginner-chord-machine'),
  require('./drum-pad'),
  require('./isomorphic-keyboard'),
  require('./piano-keyboard'),
  require('./touch-screen-pedal'),
  require('./midi-keybindings'),
]

const features = featureModules.map(m => m.default)

function render() {
  ReactDOM.render(<App features={features} />, main)
}

let wasDown
function updateGamepads() {
  let down = false
  for (const gamepad of navigator.getGamepads()) {
    if (!gamepad) continue
    for (let i = 10; i <= 11; i++) {
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

if (module.hot) {
  module.hot.accept('./core', render)
}

setInterval(updateGamepads, 16)

render()
