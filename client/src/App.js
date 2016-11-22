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
        <div className='Appのright'>
          <MIDIStatus />
        </div>
      </div>
      <div className='Appのstuff'>
        <Keyboard />
      </div>
    </div>
  )
}

const MIDIStatus = observer(class MIDIStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
  }
  handleToggle = () => {
    this.setState({ open: !this.state.open })
  }
  render () {
    return (
      <div style={{ display: 'inline-block', verticalAlign: 'middle', position: 'relative' }}>
        <button className='AppのmidiSettings' onClick={this.handleToggle}>
          {MIDI.getStatus()}
        </button>
        {this.renderSelector()}
      </div>
    )
  }
  renderSelector () {
    if (!this.state.open) return null
    return (
      <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <div style={{ position: 'absolute', top: -1, right: 0 }}>
          <div style={{ background: '#090807', border: '1px solid #656463', lineHeight: 1.25, whiteSpace: 'nowrap' }}>
            {MIDI.getOutputs().map((output) => {
              return <div key={output.key}>
                <button style={{ font: 'inherit', color: 'inherit', border: 0, margin: 0, padding: '4px 6px', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => { MIDI.selectOutput(output.key) }}>
                  {output.name}
                </button>
              </div>
            })}
          </div>
        </div>
      </div>
    )
  }
})

export default App
