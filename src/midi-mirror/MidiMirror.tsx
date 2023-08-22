import { MIDI, Store, useConfiguration } from '../core'

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tw } from 'twind'
import { $midiAccess, enumerateKeys } from '../core-midi'
import { atom, computed, onMount } from 'nanostores'
import { useStore } from '../nanostore-utils'
import { useObserver } from 'mobx-react'

const $refreshCount = atom(0)
const $selectedInput = atom('')
const $inputInfo = computed([$midiAccess, $refreshCount], (access) => {
  if (!access) return []
  const keys = enumerateKeys(access.inputs)
  const inputs = keys.flatMap((key) => {
    const input = access.inputs.get(key)
    return input ? [{ key, input }] : []
  })
  return inputs
})

let transpose = 0
let channel = 0
const offMap = new Map<number, number[]>()

export function MidiMirror(props: { store: Store }) {
  return (
    <div
      className={tw`absolute inset-0 flex flex-col justify-center items-center text-center`}
    >
      <div className={tw`text-3xl pre-wrap focus:font-bold p-4`} tabIndex={0}>
        <StatusViewer />
      </div>
      <div>
        <InputSelector />
      </div>
      <MirrorChannelSettingWorker />
      <MirrorTransposeSettingWorker store={props.store} />
      <MirrorWorker />
    </div>
  )
}

function StatusViewer() {
  const selectedInput = useStore($selectedInput)
  return <>{selectedInput ? 'Selected input' : 'No input selected'}</>
}

function InputSelector() {
  const inputs = useStore($inputInfo)
  const selectedInput = useStore($selectedInput)
  return (
    <div className={tw`flex gap-2`}>
      <select
        value={selectedInput}
        className={tw`bg-black`}
        onChange={(e) => {
          const value = e.target.value
          $selectedInput.set(value)
        }}
      >
        <option value="">-- none --</option>
        {inputs.map(({ key, input }) => (
          <option value={key} key={key}>
            {input.name}
          </option>
        ))}
      </select>
      <button className={tw`bg-black px-2 py-1`}>Refresh</button>
    </div>
  )
}

export function MirrorChannelSettingWorker() {
  const { value: configuredChannel } = useConfiguration<string>(
    'midi.output.channel'
  )
  useLayoutEffect(() => {
    channel = +configuredChannel || 1
  }, [configuredChannel])
  return <></>
}

export function MirrorTransposeSettingWorker(props: { store: Store }) {
  const currentTranspose = useObserver(() => props.store.transpose)
  useLayoutEffect(() => {
    transpose = +currentTranspose || 0
  }, [currentTranspose])
  return <></>
}

export function MirrorWorker() {
  const midiAccess = useStore($midiAccess)
  const selectedInputKey = useStore($selectedInput)
  const selectedInput = useMemo(() => {
    if (!selectedInputKey || !midiAccess) return null
    const input = midiAccess.inputs.get(selectedInputKey)
    return input
  }, [midiAccess, selectedInputKey])
  useEffect(() => {
    if (!selectedInput) return
    const listener = (event: WebMidi.MIDIMessageEvent) => {
      if (event.currentTarget !== selectedInput) return
      let data = Array.from(event.data)

      // Only process note on/off, control change.
      const command = data[0] >> 4
      if (command !== 8 && command !== 9 && command !== 11) return

      // Replace the channel.
      data[0] = (data[0] & 0xf0) | (channel - 1)

      // For note on/off, transpose the note.
      if (command === 8 || command === 9) {
        // Note on - transpose and remember the note.
        if (command === 9 && data[2] > 0) {
          const oldNote = data[1]
          data[1] = Math.min(127, Math.max(0, data[1] + transpose))
          const offMessage = [0x80 | (data[0] & 0xf), data[1], data[2]]
          offMap.set(oldNote, offMessage)
        } else {
          // Note off - use the remembered note.
          const offMessage = offMap.get(data[1])
          if (offMessage) {
            offMap.delete(data[1])
            data = offMessage
          }
        }
      }

      // Send the message.
      MIDI.send(data)
    }
    selectedInput.addEventListener('midimessage', listener)
    return () => {
      selectedInput.removeEventListener('midimessage', listener as any)
    }
  })
  return null
}
