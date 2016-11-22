import { observable, action } from 'mobx'

export const store = observable({
  status: 'Initializing MIDI system'
})

const setStatus = action('setStatus', (status) => {
  store.status = status
})

function ok (access) {
  setStatus('Found MIDI outputs: ' + access.outputs.size)
  try {
    const output = access.outputs.values().next().value
    window.midiOutput = output
    setStatus('Using output: ' + output.name)
  } catch (e) {
    setStatus('Cannot access mIDI output ' + e)
  }
}

export function send (data) {
  if (window.midiOutput) {
    window.midiOutput.send(data)
  }
}

function init () {
  if (window.midiAccess) {
    setStatus('MIDI saved!!')
    ok(window.midiAccess)
    return
  }
  if (navigator.requestMIDIAccess) {
    setStatus('Requesting MIDI access')
    navigator.requestMIDIAccess({ sysex: false }).then(
      (access) => {
        window._midiAccess = access
        ok(window._midiAccess)
      },
      (e) => {
        setStatus('MIDI cannot request!! ' + e)
      }
    )
  } else {
    setStatus('MIDI not supported')
  }
}

setTimeout(init)
