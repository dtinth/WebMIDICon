import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'

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

if (module.hot) {
  module.hot.accept('./core', render)
}

render()
