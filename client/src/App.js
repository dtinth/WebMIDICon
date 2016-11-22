import './App.css'
import * as MIDI from './MIDI'

import React from 'react'
import { observer } from 'mobx-react'

import Keyboard from './Keyboard'

export function App () {
  return (
    <div className='App'>
      <div className='Appのheader'>
        <div className='Appのtitle'>
          my web based instruments
        </div>
        <button className='AppのmidiSettings'>
          <MIDIStatus />
        </button>
      </div>
      <div className='Appのstuff'>
        <Keyboard />
      </div>
    </div>
  )
}

const MIDIStatus = observer(function MIDIStatus () {
  return <span>{MIDI.store.status}</span>
})

export default App
