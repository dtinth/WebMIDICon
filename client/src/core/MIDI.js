import { action, observable } from 'mobx'

const store = observable({
  status: 'Initializing MIDI system',
  outputs: [],
  selectedOutputKey: null,
  requiresNewWindow: false,
})

export function getStatus() {
  return store.status
}

export function isNewWindowRequired() {
  return store.requiresNewWindow
}

export function getOutputs() {
  return store.outputs
}

export function isSelected(outputKey) {
  return store.selectedOutputKey === outputKey
}

export const selectOutput = action('selectOutput', outputKey => {
  const access = window.midiAccess
  if (!access) return
  const output = access.outputs.get(outputKey)
  if (!output) return window.alert('No output key ' + outputKey + ' found')
  window.midiOutput = output
  setStatus('Using output: ' + output.name)
})

const setStatus = action('setStatus', status => {
  store.status = status
})

const requireNewWindow = action('requireNewWindow', () => {
  store.status =
    'MIDI not available in CodeSandbox preview, please Open in New Window'
  store.requiresNewWindow = true
})

const handleAvailableOutputs = action('handleAvailableOutputs', outputs => {
  store.outputs = outputs
  for (const output of outputs) {
    if (store.selectedOutputKey === output.key) return
  }
  if (!store.selectedOutputKey) {
    if (outputs.length) {
      store.selectedOutputKey = outputs[0].key
    } else {
      store.selectedOutputKey = null
    }
  }
})

function ok(access) {
  window.midiAccess = access
  setStatus('Found MIDI outputs: ' + access.outputs.size)
  try {
    refreshOutputList(access)
  } catch (e) {
    setStatus('Cannot access MIDI output ' + e)
  }
}

function refreshOutputList(access) {
  const ports = []
  const iterator = access.outputs.keys()
  for (;;) {
    const { done, value: key } = iterator.next()
    if (done) break
    ports.push({ key, name: access.outputs.get(key).name })
  }
  const previousKey = store.selectedOutputKey
  handleAvailableOutputs(ports)
  if (previousKey !== store.selectedOutputKey) {
    selectOutput(store.selectedOutputKey)
  }
}

export function send(data) {
  console.log(data)
  if (window.midiOutput) {
    window.midiOutput.send(data)
  }
}

function onStateChange(access) {
  refreshOutputList(access)
}

function init() {
  if (window.midiAccess) {
    setStatus('MIDI saved!!')
    ok(window.midiAccess)
    return
  }
  if (navigator.requestMIDIAccess) {
    setStatus('Requesting MIDI access')
    navigator.requestMIDIAccess({ sysex: false }).then(
      access => {
        ok(access)
        access.onstatechange = () => onStateChange(access)
      },
      e => {
        if (
          String(e).match(/^SecurityError:/) &&
          window.location.hostname.match(/\.codesandbox\.io$/)
        ) {
          requireNewWindow()
        } else {
          setStatus('Failed to request MIDI access! ' + e)
        }
      }
    )
  } else if (
    /* global webkit */
    typeof webkit !== 'undefined' &&
    webkit.messageHandlers &&
    webkit.messageHandlers.send &&
    webkit.messageHandlers.send.postMessage
  ) {
    ok(sham(webkit.messageHandlers.send))
  } else {
    setStatus('MIDI not supported')
  }
}

function sham(port) {
  const midiAccess = {
    outputs: new Map(),
  }
  midiAccess.outputs.set('bluetooth', {
    name: 'Bluetooth',
    send: bytes => port.postMessage(bytes.join(';')),
  })
  return midiAccess
}

setTimeout(init)
