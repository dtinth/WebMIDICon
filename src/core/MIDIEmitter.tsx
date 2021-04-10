import * as MIDI from './MIDI'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Store } from './types'
import { useConfiguration } from './AppConfigurationHooks'

type Props = {
  activeNotes: Store['activeNotes']
  transpose: Store['transpose']
  octave: Store['octave']
  velocity: Store['noteVelocity']
}

export default function MIDIEmitter(props: Props) {
  const propsRef = useRef(props)
  useLayoutEffect(() => {
    propsRef.current = props
  }, [props])

  const { value: configuredChannel } = useConfiguration<string>(
    'midi.output.channel'
  )
  const channel = +configuredChannel || 1
  const channelRef = useRef(channel)
  useLayoutEffect(() => {
    channelRef.current = channel
  }, [channel])

  const [emitter] = useState(() =>
    createMIDIEmitter({
      getTranspose: () => propsRef.current.transpose,
      getOctave: () => propsRef.current.octave,
      getVelocity: () => propsRef.current.velocity,
      getChannel: () => channelRef.current,
    })
  )
  useLayoutEffect(() => {
    emitter.handleNotes(props.activeNotes)
  }, [props.activeNotes])
  return null
}

function createMIDIEmitter(config: {
  getTranspose: () => number
  getOctave: () => number
  getVelocity: () => number
  getChannel: () => number
}) {
  const currentNotes = new Map<number, { off: () => void }>()

  return {
    handleNotes(activeNotes: Set<number>) {
      for (const note of activeNotes) {
        if (!currentNotes.has(note)) {
          const midiNote =
            note + config.getTranspose() + config.getOctave() * 12
          const velocity = config.getVelocity()
          const channel = config.getChannel()
          MIDI.send([0x90 + channel - 1, midiNote, velocity])
          const currentNote = {
            off: () => {
              MIDI.send([0x80 + channel - 1, midiNote, velocity])
            },
          }
          currentNotes.set(note, currentNote)
        }
      }
      for (const note of currentNotes.keys()) {
        if (!activeNotes.has(note)) {
          const currentNote = currentNotes.get(note)
          currentNote?.off()
          currentNotes.delete(note)
        }
      }
    },
  }
}
