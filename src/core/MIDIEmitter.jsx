import * as MIDI from './MIDI'
import React from 'react'

export default class MIDIEmitter extends React.Component {
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
        const velocity = props.velocity
        MIDI.send([0x90, midiNote, velocity])
        currentNotes.set(note, { midiNote, velocity })
      }
    }
    for (const note of currentNotes.keys()) {
      if (!activeNotes.has(note)) {
        const data = currentNotes.get(note)
        MIDI.send([0x80, data.midiNote, data.velocity])
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
