import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'
import { featureModules } from './features'
import * as serviceWorker from './serviceWorker'

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

const features = featureModules.map((m) => m.default)

function render() {
  ReactDOM.render(<App features={features} />, main)
}

declare global {
  interface NodeModule {
    hot: any
  }
}

render()
serviceWorker.register()
