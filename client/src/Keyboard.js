import './Keyboard.css'
import * as MIDI from './MIDI'

import React from 'react'
import { observer } from 'mobx-react'

import createStore from './createStore'
import IsomorphicKeyboard from './IsomorphicKeyboard'
import KeyboardToolbar from './KeyboardToolbar'
import PianoKeyboard from './PianoKeyboard'
import { getHash } from './Hash'

export const Keyboard = observer(class Keyboard extends React.PureComponent {
  constructor (props) {
    super(props)
    this.store = createStore()
  }
  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    this.unsubscribe()
  }
  shouldComponentUpdate () {
    return false
  }
  handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    this.store.handleKeyDown(e.keyCode)
    e.preventDefault()
  }
  handleKeyUp = (e) => {
    this.store.handleKeyUp(e.keyCode)
    e.preventDefault()
  }
  renderContent () {
    const hash = getHash()
    switch (hash) {
      case '#piano':
        return <PianoKeyboard store={this.store} />
      case '#iso':
        return <IsomorphicKeyboard store={this.store} />
      default:
        return <div className='Keyboardのmenu'>
          <a href='#piano'>Piano</a>
          <a href='#iso'>Isokeyboard</a>
        </div>
    }
  }
  render () {
    return (
      <div>
        <div className='Keyboardのtoolbar'>
          <KeyboardToolbar store={this.store} />
        </div>
        <div className='Keyboardのcontent'>
          {this.renderContent()}
        </div>
        <MIDIEmitter
          activeNotes={this.store.activeNotes}
          transpose={this.store.transpose}
          octave={this.store.octave}
        />
      </div>
    )
  }
})

class MIDIEmitter extends React.Component {
  constructor (props) {
    super(props)
    this.currentNotes = new Map()
  }
  handleNotes (props) {
    const activeNotes = props.activeNotes
    const currentNotes = this.currentNotes
    for (const note of activeNotes) {
      if (!currentNotes.has(note)) {
        const midiNote = note + props.transpose + props.octave * 12
        MIDI.send([ 0x90, midiNote, 0x60 ])
        currentNotes.set(note, { midiNote })
      }
    }
    for (const note of currentNotes.keys()) {
      if (!activeNotes.has(note)) {
        const data = currentNotes.get(note)
        MIDI.send([ 0x80, data.midiNote, 0x60 ])
        currentNotes.delete(note)
      }
    }
  }
  componentDidMount () {
    this.handleNotes(this.props)
  }
  componentWillReceiveProps (nextProps) {
    this.handleNotes(nextProps)
  }
  render () {
    return null
  }
}

export default Keyboard
