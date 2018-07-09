import React from 'react'
import ReactDOM from 'react-dom'
import * as MIDI from './MIDI'
import App from './App'

const main = document.createElement('div')
main.id = 'main'
document.body.appendChild(main)

function render() {
  ReactDOM.render(<App />, main)
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
  module.hot.accept('./App', render)
}

setInterval(updateGamepads, 16)

render()
