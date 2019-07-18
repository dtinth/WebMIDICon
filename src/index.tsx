import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'

// TODO [#20]: Add a service worker to allow this app to run offline.
// See:
// - https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template-typescript/src/serviceWorker.ts
// - https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

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

declare global {
  interface NodeModule {
    hot: any
  }
}

if (module.hot) {
  module.hot.accept('./core', render)
}

render()
