import './App.css'

import React from 'react'

import Keyboard from './Keyboard'

export function App () {
  return (
    <div className='App'>
      <div className='Appのheader'>
        <div className='Appのtitle'>
          my web based instruments
        </div>
        <button className='AppのmidiSettings'>
          MIDI settings
        </button>
      </div>
      <div className='Appのstuff'>
        <Keyboard />
      </div>
    </div>
  )
}

export default App
