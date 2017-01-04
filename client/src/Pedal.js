import * as MIDI from './MIDI'

import React from 'react'

export class DrumPad extends React.PureComponent {
  render () {
    return (
      <div
        onTouchStart={this.handleTouch}
        onTouchMove={this.handleTouch}
        onTouchEnd={this.handleTouch}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: '20vw', fontWeight: 'bold' }}>iPedal</div>
        <div
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'white' }}
          ref={(div) => { this.div = div }}
        />
      </div>
    )
  }
  handleTouch = (e) => {
    const pressure = e.touches.length
    const opacity = Math.pow(pressure / 11, 1 / 3)
    if (this.div) {
      this.div.style.opacity = opacity
    }
    if (this._pressure <= 1 && pressure > 1) {
      MIDI.send([ 0xB0, 0x40, 127 ])
    }
    if (this._pressure > 1 && pressure <= 1) {
      MIDI.send([ 0xB0, 0x40, 0 ])
    }
    this._pressure = pressure
    e.preventDefault()
  }
}

export default DrumPad
