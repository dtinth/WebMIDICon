import { setup } from 'twind'
import { registerSW } from 'virtual:pwa-register'

import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './core'
import { featureModules } from './features'
import { registerUpdate } from './core/PWAUpdate'

setup({
  theme: {
    fontFamily: {
      sans: ['Arimo', 'Helvetica', 'sans-serif'],
    },
    extend: {
      colors: {
        '#e9e8e7': '#e9e8e7',
        '#8b8685': '#8b8685',
        '#656463': '#656463',
        '#454443': '#454443',
        '#353433': '#353433',
        '#252423': '#252423',
        '#090807': '#090807',
        '#bbeeff': '#bbeeff',
        '#d7fc70': '#d7fc70',
        '#ffffbb': '#ffffbb',
      },
    },
  },
})

const updateSW = registerSW({
  onNeedRefresh() {
    registerUpdate(() => updateSW(true))
  },
  onOfflineReady() {
    console.log('Offline ready')
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
