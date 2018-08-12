import * as MIDI from './MIDI'

import KeyboardToolbar from './KeyboardToolbar'
import React from 'react'
import createStore from './createStore'
import { getHash } from './Hash'
import { observer } from 'mobx-react'
import styled from 'react-emotion'

const KeyboardMenu = styled('div')`
  font-size: 5vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const KeyboardMenuItem = styled('div')`
  flex-basis: 48%;
`

const KeyboardMenuLink = styled('a')`
  color: #e9e8e7;
  display: block;
  background: #090807;
  margin: 0.5em;
  padding: 0.5em;
  border: 2px solid #555453;
  text-align: center;
  text-decoration: none;
`

const KeyboardToolbarWrapper = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  height: 40px;
  left: 0;
`

const KeyboardContent = styled('div')`
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
`

export const Keyboard = observer(
  class Keyboard extends React.Component {
    constructor(props) {
      super(props)
      this.store = createStore()
    }
    componentDidMount() {
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
    }
    componentWillUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keyup', this.handleKeyUp)
    }
    shouldComponentUpdate() {
      return false
    }
    handleKeyDown = e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      this.store.handleKeyDown(e.keyCode)
      e.preventDefault()
    }
    handleKeyUp = e => {
      this.store.handleKeyUp(e.keyCode)
      e.preventDefault()
    }
    renderContent() {
      const hash = getHash()
      const found = this.props.instruments.filter(
        instrument => hash === `#${instrument.id}`
      )[0]
      if (found) {
        const Component = found.component
        console.log('Conpnent found', found)
        return <Component store={this.store} />
      }
      console.log('Conpnent not found')
      return (
        <KeyboardMenu>
          {this.props.instruments.map(instrument => (
            <React.Fragment key={instrument.id}>
              {this.renderMenuItem(
                `#${instrument.id}`,
                instrument.name,
                instrument.description
              )}
            </React.Fragment>
          ))}
        </KeyboardMenu>
      )
    }
    renderMenuItem(href, text, description) {
      return (
        <KeyboardMenuItem>
          <KeyboardMenuLink href={href}>{text}</KeyboardMenuLink>
        </KeyboardMenuItem>
      )
    }
    render() {
      return (
        <div>
          <KeyboardToolbarWrapper>
            <KeyboardToolbar store={this.store} />
          </KeyboardToolbarWrapper>
          <KeyboardContent>{this.renderContent()}</KeyboardContent>
          <MIDIEmitter
            activeNotes={this.store.activeNotes}
            transpose={this.store.transpose}
            octave={this.store.octave}
          />
        </div>
      )
    }
  }
)

class MIDIEmitter extends React.Component {
  constructor(props) {
    super(props)
    this.currentNotes = new Map()
  }
  handleNotes(props) {
    const activeNotes = props.activeNotes
    const currentNotes = this.currentNotes
    for (const note of activeNotes) {
      if (!currentNotes.has(note)) {
        const midiNote = note + props.transpose + props.octave * 12
        MIDI.send([0x90, midiNote, 0x60])
        currentNotes.set(note, { midiNote })
      }
    }
    for (const note of currentNotes.keys()) {
      if (!activeNotes.has(note)) {
        const data = currentNotes.get(note)
        MIDI.send([0x80, data.midiNote, 0x60])
        currentNotes.delete(note)
      }
    }
  }
  componentDidMount() {
    this.handleNotes(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.handleNotes(nextProps)
  }
  render() {
    return null
  }
}

export default Keyboard
