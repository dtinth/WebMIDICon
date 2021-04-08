import { setup } from 'twind'

import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'
import { featureModules } from './features'

setup({
  theme: {
    fontFamily: {
      sans: ['Arimo', 'Helvetica', 'sans-serif'],
    },
  },
})

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
