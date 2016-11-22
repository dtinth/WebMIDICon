import './Keyboard.css'
import * as MIDI from './MIDI'

import React from 'react'
import { observer } from 'mobx-react'

import createStore from './createStore'
import IsomorphicKeyboard from './IsomorphicKeyboard'
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
        {this.renderContent()}
        <MIDIEmitter activeNotes={this.store.activeNotes} />
      </div>
    )
  }
})

class MIDIEmitter extends React.Component {
  constructor (props) {
    super(props)
    this.handleNotes = (() => {
      let previous = new Set()
      return function (next) {
        for (const note of next) {
          if (!previous.has(note)) {
            MIDI.send([ 0x90, note + 36, 0x60 ])
          }
        }
        for (const note of previous) {
          if (!next.has(note)) {
            MIDI.send([ 0x80, note + 36, 0x60 ])
          }
        }
        previous = next
      }
    })()
  }
  componentDidMount () {
    this.handleNotes(this.props.activeNotes)
  }
  componentWillReceiveProps (nextProps) {
    this.handleNotes(nextProps.activeNotes)
  }
  render () {
    return null
  }
}

export default Keyboard
