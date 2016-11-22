import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

const main = document.createElement('div')
main.id = 'main'
document.body.appendChild(main)

function render () {
  ReactDOM.render(<App />, main)
}

if (module.hot) {
  module.hot.accept('./App', render)
}

render()
