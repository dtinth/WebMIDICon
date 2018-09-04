import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'

const main = (() => {
  const existing = document.getElementById('main')
  if (existing) return existing
  const div = document.createElement('div')
  div.id = 'main'
  document.body.appendChild(div)
  return div
})()

const featureModules = [
  require('./beginner-chord-machine'),
  require('./drum-pad'),
  require('./isomorphic-keyboard'),
  require('./piano-keyboard'),
  require('./midi-keybindings'),
  require('./touch-pedal'),
  require('./joypedal'),
]

const features = featureModules.map(m => m.default)

function render() {
  ReactDOM.render(<App features={features} />, main)
}

if (module.hot) {
  module.hot.accept('./core', render)
}

render()
