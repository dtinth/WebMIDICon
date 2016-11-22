
const div = document.createElement('div')
div.setAttribute('style', 'position:absolute;z-index:99;top:0;left:0;background:#654;color:#dec')
div.textContent = 'MIDI service'
document.body.appendChild(div)

if (module.hot) {
  module.hot.dispose(() => {
    document.body.removeChild(div)
  })
}

function ok (access) {
  setStatus('MIDI outputs: ' + access.outputs.size)
  try {
    const output = access.outputs.values().next().value
    window._midiOutput = output
    setStatus('Using output: ' + output)
  } catch (e) {
    setStatus('Cannot access mIDI output ' + e)
  }
}

export function send (data) {
  console.log(data)
  if (window._midiOutput) {
    setStatus('Output: ' + data)
    window._midiOutput.send(data)
  } else {
    setStatus('...MIDI not initalized but wana send ' + data)
  }
}

setTimeout(() => {
  if (window._midiAccess) {
    setStatus('MIDI saved!!')
    ok(window._midiAccess)
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
}, 500)

function setStatus (text) {
  div.textContent = text
}
