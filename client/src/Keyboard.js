import './Keyboard.css'
import * as MIDI from './MIDI'

import React from 'react'
import { autorun } from 'mobx'

import createStore from './createStore'
import IsomorphicKeyboard from './IsomorphicKeyboard'
import PianoKeyboard from './PianoKeyboard'

const handleNotes = (() => {
  let previous = new Set()
  return function (next) {
    for (const note of next) {
      if (!previous.has(note)) {
        MIDI.send([ 0x90, note + 32, 0x60 ])
      }
    }
    for (const note of previous) {
      if (!next.has(note)) {
        MIDI.send([ 0x80, note + 32, 0x60 ])
      }
    }
    previous = next
  }
})()

export class Keyboard extends React.Component {
  constructor (props) {
    super(props)
    this.store = createStore()
  }
  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    this.unsubscribe = autorun(() => {
      handleNotes(this.store.activeNotes)
    })
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
    this.store.handleKeyDown(e.keyCode)
    e.preventDefault()
  }
  handleKeyUp = (e) => {
    this.store.handleKeyUp(e.keyCode)
    e.preventDefault()
  }
  render () {
    // return <PianoKeyboard store={this.store} />
    return <IsomorphicKeyboard store={this.store} />
  }
}

export default Keyboard
