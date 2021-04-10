import { MIDI, useConfiguration } from '../core'
import React from 'react'
import { DrumPadContents } from './DrumPad'

export function DrumPadContainer() {
  const mainChannel = useConfiguration<string>('midi.output.channel')
  const drumChannel = useConfiguration<string>('drumPad.midiChannelOverride')
  const onTrigger = (note: number, velocity: number) => {
    const midiVelocity = Math.max(0, Math.min(127, Math.round(velocity * 127)))
    const channel = +drumChannel.value || +mainChannel.value || 10
    MIDI.send([0x90 + channel - 1, note, midiVelocity])
    MIDI.send([0x80 + channel - 1, note, midiVelocity])
  }
  return <DrumPadContents onTrigger={onTrigger} />
}
